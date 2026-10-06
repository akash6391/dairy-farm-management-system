from pydantic import BaseModel
from typing import List


class FarmSummaryResponse(BaseModel):
    total_animals: int
    total_milk_produced_liters: float
    total_sales_revenue: float
    total_expenses: float
    net_profit_loss: float
    total_inventory_items: int


class MilkTrend(BaseModel):
    date: str
    liters: float


class FinancialTrend(BaseModel):
    date: str
    revenue: float
    expenses: float


class AnalyticsTrendsResponse(BaseModel):
    milk_production: List[MilkTrend]
    financial: List[FinancialTrend]