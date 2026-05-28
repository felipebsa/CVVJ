from database import Base, engine
from fastapi import FastAPI
from routes.vehicle import router
from models.vehicle import Vehicle

app = FastAPI()
Base.metadata.create_all(bind=engine)
app.include_router(router)
