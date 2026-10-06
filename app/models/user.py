from sqlalchemy import Column, Integer, String, Boolean
from database import Base

class UserDB(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="worker")  # "admin" ya "worker"
    is_active = Column(Boolean, default=True)