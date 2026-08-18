from pydantic import BaseModel


class ResourceCreate(BaseModel):
    resource_type: str
    name: str
    quantity: int = 0
    status: str
    latitude: float
    longitude: float


class ResourceUpdate(BaseModel):
    resource_type: str
    name: str
    quantity: int = 0
    status: str
    latitude: float
    longitude: float


class ResourceResponse(BaseModel):
    id: int
    resource_type: str
    name: str
    quantity: int
    status: str
    latitude: float
    longitude: float

    class Config:
        from_attributes = True