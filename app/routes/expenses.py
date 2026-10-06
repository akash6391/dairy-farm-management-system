from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database import get_db
from models.expense import ExpenseLogDB
from schemas.expense import ExpenseCreate, ExpenseResponse
from typing import List

router = APIRouter(prefix="/api", tags=["Financial Ledger & Expenses"])

@router.post("/expenses", response_model=ExpenseResponse, status_code=status.HTTP_201_CREATED)
async def create_expense(expense: ExpenseCreate, db: AsyncSession = Depends(get_db)):
    new_expense = ExpenseLogDB(**expense.dict())
    db.add(new_expense)
    await db.commit()
    await db.refresh(new_expense)
    return new_expense

@router.get("/expenses", response_model=List[ExpenseResponse])
async def get_expenses(category: str = None, db: AsyncSession = Depends(get_db)):
    query = select(ExpenseLogDB)
    if category:
        query = query.filter(ExpenseLogDB.category.ilike(f"%{category}%"))
    result = await db.execute(query)
    return result.scalars().all()