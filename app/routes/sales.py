from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database import get_db
from models.sales import SalesLogDB
from schemas.sales import SalesLogCreate, SalesLogResponse
from typing import List

router = APIRouter(prefix="/api", tags=["Milk Sales & Billing"])

@router.post("/sales", response_model=SalesLogResponse, status_code=status.HTTP_201_CREATED)
async def create_sale_log(sale: SalesLogCreate, db: AsyncSession = Depends(get_db)):
    # Total amount automatic calculate karein
    calculated_total = sale.quantity_liters * sale.rate_per_liter

    new_sale = SalesLogDB(
        customer_name=sale.customer_name,
        quantity_liters=sale.quantity_liters,
        rate_per_liter=sale.rate_per_liter,
        total_amount=calculated_total,
        payment_status=sale.payment_status
    )
    
    db.add(new_sale)
    await db.commit()
    await db.refresh(new_sale)
    return new_sale

@router.get("/sales", response_model=List[SalesLogResponse])
async def get_sales_logs(customer_name: str = None, db: AsyncSession = Depends(get_db)):
    query = select(SalesLogDB)
    if customer_name:
        query = query.filter(SalesLogDB.customer_name.ilike(f"%{customer_name}%"))
    result = await db.execute(query)
    return result.scalars().all()