from sqlalchemy import Column, Integer, String, Float
from app.database.base import Base


class Shelter(Base):
    __tablename__ = "shelters"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    address = Column(String)
    capacity = Column(Integer)
    latitude = Column(Float)
    longitude = Column(Float)