from database import Base, engine
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

#routers
from routes.vehicle import router as vehicle_router
from routes.services import router as service_router
from routes.vehicle_images import router as image_router

#models
from models.vehicle import Vehicle
from models.services import Service
from models.vehicle_images import Images

app = FastAPI()
Base.metadata.create_all(bind=engine)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

#settings Cors
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

#include routers
app.include_router(vehicle_router)
app.include_router(service_router)
app.include_router(image_router)