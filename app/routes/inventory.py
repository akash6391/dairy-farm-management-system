from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database import get_db
from models.inventory import InventoryDB
from schemas.inventory import InventoryCreate, InventoryResponse
from typing import List

router = APIRouter(prefix="/api", tags=["Feed & Inventory Management"])

@router.post("/inventory", response_model=InventoryResponse, status_code=status.HTTP_201_CREATED)
async def add_inventory_item(item: InventoryCreate, db: AsyncSession = Depends(get_db)):
    new_item = InventoryDB(**item.dict())
    db.add(new_item)
    await db.commit()
    await db.refresh(new_item)
    return new_item

@router.get("/inventory", response_model=List[InventoryResponse])
async def get_inventory_items(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(InventoryDB))
    return result.scalars().all()