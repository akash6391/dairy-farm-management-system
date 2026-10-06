from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class InventoryCreate(BaseModel):
    item_name: str
    category: str
    quantity: float
    unit: str
    unit_price: Optional[float] = None

    class Config:
        from_attributes = True

class InventoryResponse(InventoryCreate):
    id: int
    last_updated: datetime