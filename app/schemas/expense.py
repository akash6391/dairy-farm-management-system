from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ExpenseCreate(BaseModel):
    title: str
    category: str
    amount: float
    payment_method: Optional[str] = "Cash"
    notes: Optional[str] = None

    class Config:
        from_attributes = True

class ExpenseResponse(ExpenseCreate):
    id: int
    date: datetime