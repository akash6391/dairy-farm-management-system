from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from database import Base

class AnimalDB(Base):
    __tablename__ = "animals"

    id = Column(Integer, primary_key=True, index=True)
    tag_id = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=True)
    breed = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String, default="Female")
    health_status = Column(String, default="Healthy")
    vaccination_date = Column(DateTime, nullable=True)
    status = Column(String, default="Milking") # Milking, Pregnant, Dry

class MilkLogDB(Base):
    __tablename__ = "milk_logs"

    id = Column(Integer, primary_key=True, index=True)
    animal_tag_id = Column(String, ForeignKey("animals.tag_id"), nullable=False)
    date = Column(DateTime(timezone=True), server_default=func.now())
    shift = Column(String, nullable=False) # Morning, Evening
    quantity_liters = Column(Float, nullable=False)
    fat_percentage = Column(Float, nullable=True)
    snf_percentage = Column(Float, nullable=True)