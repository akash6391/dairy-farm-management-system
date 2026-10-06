from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class SalesLogCreate(BaseModel):
    customer_name: str
    quantity_liters: float
    rate_per_liter: float
    payment_status: Optional[str] = "Pending"  # Pending, Paid

    class Config:
        from_attributes = True

class SalesLogResponse(SalesLogCreate):
    id: int
    total_amount: float
    date: datetime