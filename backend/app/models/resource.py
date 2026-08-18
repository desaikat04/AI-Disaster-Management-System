from sqlalchemy import Column, Integer, String, Float
from app.database.base import Base


class Resource(Base):
    __tablename__ = "resources"

    id = Column(Integer, primary_key=True, index=True)

    resource_type = Column(String, nullable=False)
    name = Column(String, nullable=False)

    quantity = Column(Integer, default=0, nullable=False)
    
    status = Column(String, default="Available")


    latitude = Column(Float)
    longitude = Column(Float)