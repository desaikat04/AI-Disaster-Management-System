from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.models.disaster_event import DisasterEvent
from app.schemas.disaster_event import DisasterEventCreate

router = APIRouter(prefix="/disasters", tags=["Disasters"])


@router.post("/")
def create_disaster(
    disaster: DisasterEventCreate,
    db: Session = Depends(get_db)
):
    new_disaster = DisasterEvent(
        disaster_type=disaster.disaster_type,
        location=disaster.location,
        severity=disaster.severity,
        latitude=disaster.latitude,
        longitude=disaster.longitude
    )

    db.add(new_disaster)
    db.commit()
    db.refresh(new_disaster)

    return {
        "message": "Disaster created successfully",
        "id": new_disaster.id
    }
@router.get("/")
def get_all_disasters(db: Session = Depends(get_db)):
    disasters = db.query(DisasterEvent).all()
    return disasters

@router.get("/{disaster_id}")
def get_disaster(disaster_id: int, db: Session = Depends(get_db)):
    disaster = (
        db.query(DisasterEvent)
        .filter(DisasterEvent.id == disaster_id)
        .first()
    )

    if disaster is None:
        return {"message": "Disaster not found"}

    return disaster

@router.delete("/{disaster_id}")
def delete_disaster(disaster_id: int, db: Session = Depends(get_db)):
    disaster = (
        db.query(DisasterEvent)
        .filter(DisasterEvent.id == disaster_id)
        .first()
    )

    if disaster is None:
        return {"message": "Disaster not found"}

    db.delete(disaster)
    db.commit()

    return {"message": "Disaster deleted successfully"}

@router.put("/{disaster_id}")
def update_disaster(
    disaster_id: int,
    disaster: DisasterEventCreate,
    db: Session = Depends(get_db)
):
    existing = (
        db.query(DisasterEvent)
        .filter(DisasterEvent.id == disaster_id)
        .first()
    )

    if existing is None:
        return {"message": "Disaster not found"}

    existing.disaster_type = disaster.disaster_type
    existing.location = disaster.location
    existing.severity = disaster.severity
    existing.latitude = disaster.latitude
    existing.longitude = disaster.longitude

    db.commit()
    db.refresh(existing)

    return existing