from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database import get_db
from models.animal import AnimalDB
from schemas.animal import AnimalCreate, AnimalResponse
from typing import List

router = APIRouter(prefix="/api", tags=["Animals Management"])

@router.post("/animals", response_model=AnimalResponse, status_code=status.HTTP_201_CREATED)
async def create_animal(animal: AnimalCreate, db: AsyncSession = Depends(get_db)):
    # Check if tag_id already exists
    result = await db.execute(select(AnimalDB).filter(AnimalDB.tag_id == animal.tag_id))
    existing = result.scalars().first()
    if existing:
        raise HTTPException(status_code=400, detail="Animal with this Tag ID already exists.")
    
    new_animal = AnimalDB(**animal.dict())
    db.add(new_animal)
    await db.commit()
    await db.refresh(new_animal)
    return new_animal

@router.get("/animals", response_model=List[AnimalResponse])
async def get_animals(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(AnimalDB))
    return result.scalars().all()