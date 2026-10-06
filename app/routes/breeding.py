from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database import get_db
from models.breeding import BreedingLogDB
from models.animal import AnimalDB  # Animal check karne ke liye
from schemas.breeding import BreedingLogCreate, BreedingLogResponse
from typing import List

router = APIRouter(prefix="/api", tags=["Breeding Logs"])

@router.post("/breeding-logs", response_model=BreedingLogResponse, status_code=status.HTTP_201_CREATED)
async def create_breeding_log(log: BreedingLogCreate, db: AsyncSession = Depends(get_db)):
    # Check if animal exists
    result = await db.execute(select(AnimalDB).filter(AnimalDB.tag_id == log.animal_tag_id))
    animal = result.scalars().first()
    if not animal:
        raise HTTPException(status_code=404, detail="Animal with given Tag ID not found.")

    new_log = BreedingLogDB(**log.dict())
    db.add(new_log)
    await db.commit()
    await db.refresh(new_log)
    return new_log

@router.get("/breeding-logs", response_model=List[BreedingLogResponse])
async def get_breeding_logs(tag_id: str = None, db: AsyncSession = Depends(get_db)):
    query = select(BreedingLogDB)
    if tag_id:
        query = query.filter(BreedingLogDB.animal_tag_id == tag_id)
    result = await db.execute(query)
    return result.scalars().all()