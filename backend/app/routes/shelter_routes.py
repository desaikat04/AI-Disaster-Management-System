from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.models.shelter import Shelter
from app.schemas.shelter import ShelterCreate

router = APIRouter(
    prefix="/shelters",
    tags=["Shelters"]
)

# CREATE
@router.post("/")
def create_shelter(
    shelter: ShelterCreate,
    db: Session = Depends(get_db)
):
    new_shelter = Shelter(
        name=shelter.name,
        address=shelter.address,
        capacity=shelter.capacity,
        latitude=shelter.latitude,
        longitude=shelter.longitude
    )

    db.add(new_shelter)
    db.commit()
    db.refresh(new_shelter)

    return {
        "message": "Shelter created successfully",
        "id": new_shelter.id
    }


# READ ALL
@router.get("/")
def get_all_shelters(
    db: Session = Depends(get_db)
):
    return db.query(Shelter).all()


# READ BY ID
@router.get("/{shelter_id}")
def get_shelter(
    shelter_id: int,
    db: Session = Depends(get_db)
):
    shelter = (
        db.query(Shelter)
        .filter(Shelter.id == shelter_id)
        .first()
    )

    if shelter is None:
        return {
            "message": "Shelter not found"
        }

    return shelter


# UPDATE
@router.put("/{shelter_id}")
def update_shelter(
    shelter_id: int,
    shelter: ShelterCreate,
    db: Session = Depends(get_db)
):

    existing = (
        db.query(Shelter)
        .filter(Shelter.id == shelter_id)
        .first()
    )

    if existing is None:
        return {
            "message": "Shelter not found"
        }

    existing.name = shelter.name
    existing.address = shelter.address
    existing.capacity = shelter.capacity
    existing.latitude = shelter.latitude
    existing.longitude = shelter.longitude

    db.commit()
    db.refresh(existing)

    return existing


# DELETE
@router.delete("/{shelter_id}")
def delete_shelter(
    shelter_id: int,
    db: Session = Depends(get_db)
):

    shelter = (
        db.query(Shelter)
        .filter(Shelter.id == shelter_id)
        .first()
    )

    if shelter is None:
        return {
            "message": "Shelter not found"
        }

    db.delete(shelter)
    db.commit()

    return {
        "message": "Shelter deleted successfully"
    }