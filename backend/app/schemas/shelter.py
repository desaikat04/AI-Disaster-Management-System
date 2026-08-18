from pydantic import BaseModel


class ShelterCreate(BaseModel):
    name: str
    address: str
    capacity: int
    latitude: float
    longitude: float