from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import datetime

class AnimalCreate(BaseModel):
    tag_id: str
    name: Optional[str] = None
    breed: str
    age: int
    gender: Optional[str] = "Female"
    health_status: Optional[str] = "Healthy"
    vaccination_date: Optional[datetime] = None
    status: Optional[str] = "Milking"

    # Yeh validator empty string ko None bana dega
    @field_validator('vaccination_date', mode='before')
    @classmethod
    def empty_str_to_none(cls, v):
        if v == "" or v is None:
            return None
        return v

    class Config:
        from_attributes = True

class AnimalResponse(AnimalCreate):
    id: int

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