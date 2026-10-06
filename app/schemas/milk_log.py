from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import datetime

class MilkLogCreate(BaseModel):
    animal_tag_id: str
    shift: str  # Morning, Evening
    quantity_liters: float
    fat_percentage: Optional[float] = None
    snf_percentage: Optional[float] = None

    class Config:
        from_attributes = True

class MilkLogResponse(MilkLogCreate):
    id: int
    date: datetime