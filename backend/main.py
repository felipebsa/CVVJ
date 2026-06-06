from database import Base, engine
from fastapi import FastAPI

#routers
from routes.vehicle import router as vehicle_router
from routes.services import router as service_router

#models
from models.vehicle import Vehicle
from models.services import Service

app = FastAPI()
Base.metadata.create_all(bind=engine)

#include routers
app.include_router(vehicle_router)
app.include_router(service_router)
