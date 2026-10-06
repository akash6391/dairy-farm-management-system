from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class BreedingLogCreate(BaseModel):
    animal_tag_id: str
    insemination_date: datetime
    expected_due_date: Optional[datetime] = None
    pregnancy_status: Optional[str] = "Pending"  # Pending, Pregnant, Delivered, Failed
    notes: Optional[str] = None

    class Config:
        from_attributes = True

class BreedingLogResponse(BreedingLogCreate):
    id: int
    created_at: datetime