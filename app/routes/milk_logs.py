from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database import get_db
from models.milk_log import MilkLogDB
from models.animal import AnimalDB  # Animal verify karne ke liye
from schemas.milk_log import MilkLogCreate, MilkLogResponse
from typing import List

router = APIRouter(prefix="/api", tags=["Milk Production Logs"])

@router.post("/milk-logs", response_model=MilkLogResponse, status_code=status.HTTP_201_CREATED)
async def create_milk_log(log: MilkLogCreate, db: AsyncSession = Depends(get_db)):
    # Verify if animal exists
    result = await db.execute(select(AnimalDB).filter(AnimalDB.tag_id == log.animal_tag_id))
    animal = result.scalars().first()
    if not animal:
        raise HTTPException(status_code=404, detail="Animal with given Tag ID not found.")

    new_log = MilkLogDB(**log.dict())
    db.add(new_log)
    await db.commit()
    await db.refresh(new_log)
    return new_log

@router.get("/milk-logs", response_model=List[MilkLogResponse])
async def get_milk_logs(tag_id: str = None, db: AsyncSession = Depends(get_db)):
    query = select(MilkLogDB)
    if tag_id:
        query = query.filter(MilkLogDB.animal_tag_id == tag_id)
    result = await db.execute(query)
    return result.scalars().all()