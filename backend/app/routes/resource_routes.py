from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.models.resource import Resource
from app.schemas.resource import ResourceCreate


router = APIRouter(
    prefix="/resources",
    tags=["Resources"]
)


# =========================
# CREATE Resource
# =========================
@router.post("/")
def create_resource(
    resource: ResourceCreate,
    db: Session = Depends(get_db)
):
    new_resource = Resource(
        resource_type=resource.resource_type,
        name=resource.name,
        quantity=resource.quantity,   # ✅ ADDED
        status=resource.status,
        latitude=resource.latitude,
        longitude=resource.longitude
    )

    db.add(new_resource)
    db.commit()
    db.refresh(new_resource)

    return {
        "message": "Resource created successfully",
        "id": new_resource.id
    }


# =========================
# READ All Resources
# =========================
@router.get("/")
def get_resources(
    db: Session = Depends(get_db)
):
    resources = db.query(Resource).all()

    return resources


# =========================
# READ Single Resource
# =========================
@router.get("/{resource_id}")
def get_resource(
    resource_id: int,
    db: Session = Depends(get_db)
):
    resource = (
        db.query(Resource)
        .filter(Resource.id == resource_id)
        .first()
    )

    if not resource:
        raise HTTPException(
            status_code=404,
            detail="Resource not found"
        )

    return resource


# =========================
# UPDATE Resource
# =========================
@router.put("/{resource_id}")
def update_resource(
    resource_id: int,
    updated_resource: ResourceCreate,
    db: Session = Depends(get_db)
):
    resource = (
        db.query(Resource)
        .filter(Resource.id == resource_id)
        .first()
    )

    if not resource:
        raise HTTPException(
            status_code=404,
            detail="Resource not found"
        )

    resource.resource_type = updated_resource.resource_type
    resource.name = updated_resource.name
    resource.quantity = updated_resource.quantity   # ✅ ADDED
    resource.status = updated_resource.status
    resource.latitude = updated_resource.latitude
    resource.longitude = updated_resource.longitude

    db.commit()
    db.refresh(resource)

    return {
        "message": "Resource updated successfully",
        "resource": resource
    }


# =========================
# DELETE Resource
# =========================
@router.delete("/{resource_id}")
def delete_resource(
    resource_id: int,
    db: Session = Depends(get_db)
):
    resource = (
        db.query(Resource)
        .filter(Resource.id == resource_id)
        .first()
    )

    if not resource:
        raise HTTPException(
            status_code=404,
            detail="Resource not found"
        )

    db.delete(resource)
    db.commit()

    return {
        "message": "Resource deleted successfully"
    }