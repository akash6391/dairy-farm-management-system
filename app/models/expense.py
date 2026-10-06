from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from sqlalchemy.sql import func
from database import Base

class ExpenseLogDB(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)          # e.g., Vet Doctor Fee, Labor Wages, Electricity Bill
    category = Column(String, nullable=False)       # e.g., Medical, Labor, Utility, Feed Purchase
    amount = Column(Float, nullable=False)          # Kitna kharch hua
    payment_method = Column(String, default="Cash") # Cash, UPI, Bank Transfer
    notes = Column(Text, nullable=True)             # Additional details
    date = Column(DateTime(timezone=True), server_default=func.now())