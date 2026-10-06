from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from database import Base

class BreedingLogDB(Base):
    __tablename__ = "breeding_logs"

    id = Column(Integer, primary_key=True, index=True)
    animal_tag_id = Column(String, ForeignKey("animals.tag_id"), nullable=False)
    insemination_date = Column(DateTime(timezone=True), nullable=False)
    expected_due_date = Column(DateTime(timezone=True), nullable=True) # 9 months calculation ke liye
    pregnancy_status = Column(String, default="Pending") # Pending, Pregnant, Delivered, Failed
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())