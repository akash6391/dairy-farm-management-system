from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from database import Base

class InventoryDB(Base):
    __tablename__ = "inventory"

    id = Column(Integer, primary_key=True, index=True)
    item_name = Column(String, nullable=False)      # e.g., Cattle Feed, Khal, Mineral Mixture
    category = Column(String, nullable=False)       # e.g., Feed, Medicine, Equipment
    quantity = Column(Float, nullable=False)        # Quantity (e.g., 50 kg, 5 bags)
    unit = Column(String, nullable=False)          # Unit (kg, bags, packets, liters)
    unit_price = Column(Float, nullable=True)       # Per unit price
    last_updated = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())