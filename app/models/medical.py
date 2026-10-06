from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from database import Base

class MedicalLogDB(Base):
    __tablename__ = "medical_logs"

    id = Column(Integer, primary_key=True, index=True)
    animal_tag_id = Column(String, ForeignKey("animals.tag_id"), nullable=False) # Kis animal ka ilaaj hua
    diagnosis = Column(String, nullable=False)          # Bimaari ya Samasya (e.g., Mastitis, Fever, Injury)
    treatment_details = Column(Text, nullable=False)    # Dawaiyan aur treatment ka vivaran
    veterinarian_name = Column(String, nullable=True)   # Doctor ka naam
    cost = Column(Float, default=0.0)                   # Ilaj ka kharch
    next_vaccination_date = Column(DateTime(timezone=True), nullable=True) # Agli vaccine kab lagni hai
    date = Column(DateTime(timezone=True), server_default=func.now())