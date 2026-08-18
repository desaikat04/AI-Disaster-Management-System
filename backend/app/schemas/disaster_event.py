from pydantic import BaseModel

class DisasterEventCreate(BaseModel):
    disaster_type: str
    location: str
    severity: str
    latitude: float
    longitude: float