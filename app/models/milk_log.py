from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from database import Base

class MilkLogDB(Base):
    __tablename__ = "milk_logs"

    id = Column(Integer, primary_key=True, index=True)
    animal_tag_id = Column(String, ForeignKey("animals.tag_id"), nullable=False)
    date = Column(DateTime(timezone=True), server_default=func.now())
    shift = Column(String, nullable=False) # Morning, Evening
    quantity_liters = Column(Float, nullable=False)
    fat_percentage = Column(Float, nullable=True)
    snf_percentage = Column(Float, nullable=True)