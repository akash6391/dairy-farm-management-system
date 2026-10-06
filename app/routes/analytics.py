from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from database import get_db
from models.animal import AnimalDB
from models.milk_log import MilkLogDB
from models.sales import SalesLogDB
from models.expense import ExpenseLogDB
from models.inventory import InventoryDB
from schemas.analytics import FarmSummaryResponse
from datetime import datetime, timedelta
from schemas.analytics import (
    FarmSummaryResponse,
    AnalyticsTrendsResponse,
)

router = APIRouter(prefix="/api", tags=["Dashboard Analytics"])

@router.get("/analytics/summary", response_model=FarmSummaryResponse)
async def get_farm_summary(db: AsyncSession = Depends(get_db)):
    # 1. Total Animals count
    animal_count_res = await db.execute(select(func.count(AnimalDB.id)))
    total_animals = animal_count_res.scalar() or 0

    # 2. Total Milk Produced (Liters)
    milk_res = await db.execute(select(func.sum(MilkLogDB.quantity_liters)))
    total_milk = milk_res.scalar() or 0.0

    # 3. Total Sales Revenue
    sales_res = await db.execute(select(func.sum(SalesLogDB.total_amount)))
    total_sales = sales_res.scalar() or 0.0

    # 4. Total Expenses
    expense_res = await db.execute(select(func.sum(ExpenseLogDB.amount)))
    total_expenses = expense_res.scalar() or 0.0

    # 5. Net Profit / Loss Calculation
    net_profit_loss = total_sales - total_expenses

    # 6. Total Inventory Items count
    inv_count_res = await db.execute(select(func.count(InventoryDB.id)))
    total_inventory = inv_count_res.scalar() or 0

    return {
        "total_animals": total_animals,
        "total_milk_produced_liters": total_milk,
        "total_sales_revenue": total_sales,
        "total_expenses": total_expenses,
        "net_profit_loss": net_profit_loss,
        "total_inventory_items": total_inventory
    }

@router.get(
    "/analytics/trends",
    response_model=AnalyticsTrendsResponse
)
async def get_analytics_trends(
    db: AsyncSession = Depends(get_db)
):
    # Last 30 days
    today = datetime.utcnow().date()
    start_date = today - timedelta(days=29)

    # --------------------------------
    # 1. Milk Production
    # --------------------------------

    milk_query = (
        select(
            func.date(MilkLogDB.date).label("date"),
            func.sum(MilkLogDB.quantity_liters).label("liters")
        )
        .where(func.date(MilkLogDB.date) >= start_date)
        .group_by(func.date(MilkLogDB.date))
        .order_by(func.date(MilkLogDB.date))
    )

    milk_result = await db.execute(milk_query)

    milk_data = [
        {
            "date": str(row.date),
            "liters": float(row.liters or 0)
        }
        for row in milk_result
    ]

    # --------------------------------
    # 2. Sales / Revenue
    # --------------------------------

    sales_query = (
        select(
            func.date(SalesLogDB.date).label("date"),
            func.sum(SalesLogDB.total_amount).label("revenue")
        )
        .where(func.date(SalesLogDB.date) >= start_date)
        .group_by(func.date(SalesLogDB.date))
        .order_by(func.date(SalesLogDB.date))
    )

    sales_result = await db.execute(sales_query)

    sales_data = {
        str(row.date): float(row.revenue or 0)
        for row in sales_result
    }

    # --------------------------------
    # 3. Expenses
    # --------------------------------

    expense_query = (
        select(
            func.date(ExpenseLogDB.date).label("date"),
            func.sum(ExpenseLogDB.amount).label("expenses")
        )
        .where(func.date(ExpenseLogDB.date) >= start_date)
        .group_by(func.date(ExpenseLogDB.date))
        .order_by(func.date(ExpenseLogDB.date))
    )

    expense_result = await db.execute(expense_query)

    expense_data = {
        str(row.date): float(row.expenses or 0)
        for row in expense_result
    }

    # --------------------------------
    # 4. Merge Revenue + Expenses
    # --------------------------------

    all_dates = sorted(
        set(sales_data.keys()) |
        set(expense_data.keys())
    )

    financial_data = [
        {
            "date": date,
            "revenue": sales_data.get(date, 0),
            "expenses": expense_data.get(date, 0)
        }
        for date in all_dates
    ]

    return {
        "milk_production": milk_data,
        "financial": financial_data
    }