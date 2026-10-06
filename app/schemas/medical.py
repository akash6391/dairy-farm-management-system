from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class MedicalLogCreate(BaseModel):
    animal_tag_id: str
    diagnosis: str
    treatment_details: str
    veterinarian_name: Optional[str] = None
    cost: Optional[float] = 0.0
    next_vaccination_date: Optional[datetime] = None

    class Config:
        from_attributes = True

class MedicalLogResponse(MedicalLogCreate):
    id: int
    date: datetime