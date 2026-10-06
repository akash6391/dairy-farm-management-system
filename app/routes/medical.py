from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database import get_db
from models.medical import MedicalLogDB
from models.animal import AnimalDB  # Animal verify karne ke liye
from schemas.medical import MedicalLogCreate, MedicalLogResponse
from typing import List

router = APIRouter(prefix="/api", tags=["Veterinary & Medical History"])

@router.post("/medical-logs", response_model=MedicalLogResponse, status_code=status.HTTP_201_CREATED)
async def create_medical_log(log: MedicalLogCreate, db: AsyncSession = Depends(get_db)):
    # Verify if animal exists
    result = await db.execute(select(AnimalDB).filter(AnimalDB.tag_id == log.animal_tag_id))
    animal = result.scalars().first()
    if not animal:
        raise HTTPException(status_code=404, detail="Animal with given Tag ID not found.")

    new_log = MedicalLogDB(**log.dict())
    db.add(new_log)
    await db.commit()
    await db.refresh(new_log)
    return new_log

@router.get("/medical-logs", response_model=List[MedicalLogResponse])
async def get_medical_logs(tag_id: str = None, db: AsyncSession = Depends(get_db)):
    query = select(MedicalLogDB)
    if tag_id:
        query = query.filter(MedicalLogDB.animal_tag_id == tag_id)
    result = await db.execute(query)
    return result.scalars().all()