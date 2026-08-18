from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.db import engine
from app.database.base import Base

# Models
from app.models.disaster_event import DisasterEvent
from app.models.shelter import Shelter
from app.models.resource import Resource
from app.models.user import User

# Routes
from app.routes.disaster_routes import router as disaster_router
from app.routes.shelter_routes import router as shelter_router
from app.routes.resource_routes import router as resource_router
from app.routes.auth_routes import router as auth_router


# Create database tables
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="AI-Based Disaster Response Management System",
    version="1.0.0"
)


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Existing routers
app.include_router(disaster_router)
app.include_router(shelter_router)
app.include_router(resource_router)

# Authentication router
app.include_router(auth_router)


@app.get("/")
def home():
    return {
        "message": "Welcome to AI-Based Disaster Response Management System"
    }