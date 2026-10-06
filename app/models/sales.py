from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from database import Base

class SalesLogDB(Base):
    __tablename__ = "sales_logs"

    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String, nullable=False)   # e.g., Local Dairy, Rahul Sharma
    quantity_liters = Column(Float, nullable=False)  # Kitna doodh diya
    rate_per_liter = Column(Float, nullable=False)   # Rate per liter
    total_amount = Column(Float, nullable=False)     # Quantity * Rate (auto calculate kar sakte hain ya pass karein)
    payment_status = Column(String, default="Pending") # Pending, Paid
    date = Column(DateTime(timezone=True), server_default=func.now())