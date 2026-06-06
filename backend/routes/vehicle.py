from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import select
from models.vehicle import Vehicle
from schemas.vehicle import VehicleSchema, VehicleActiveSchema
from database import get_db

router = APIRouter()

@router.get("/")
def vehicle_home():
    return {"message": "successful home"}

@router.get("/vehicles/id/{id}")
def get_vehicle(id: int, db: Session = Depends(get_db)):
    query = select(Vehicle).where(Vehicle.vehicle_id==id)
    db_vehicle = db.execute(query).scalars().first()
    if db_vehicle is None:
        raise HTTPException(status_code=404, detail="not found id")
    return {"message": db_vehicle}

@router.get("/vehicles/actives/{active}")
def get_vehicle_by_active(active: bool, db: Session = Depends(get_db)):
    query = select(Vehicle).where(Vehicle.active==active)
    db_vehicles = db.execute(query).scalars().all()
    if not db_vehicles:
        raise HTTPException(status_code=404, detail="not vehicles actives")
    return {"message": db_vehicles}

@router.post("/vehicles/register")
def create_vehicle(vehicle: VehicleSchema, db: Session = Depends(get_db)):
    db_vehicle = Vehicle(
        kind = vehicle.kind,
        model = vehicle.model,
        date = vehicle.date,
        plate = vehicle.plate,
        active = vehicle.active
    )
    db.add(db_vehicle)
    db.commit()
    return {"message": "successful create_vehicle"}

@router.delete("/vehicles/{id}")
def delete_vehicle(id: int, db: Session = Depends(get_db)):
    query = select(Vehicle).where(Vehicle.vehicle_id==id)
    db_vehicle = db.execute(query).scalars().first()
    if db_vehicle is None:
        raise HTTPException(status_code=404, detail="not found id")
    db.delete(db_vehicle)
    db.commit()
    return {"message": "successful delete_vehicle"}

@router.put("/vehicles/{id}")
def update_vehicle(id: int, vehicle: VehicleSchema, db: Session = Depends(get_db)):
    query = select(Vehicle).where(Vehicle.vehicle_id==id)
    db_vehicle = db.execute(query).scalars().first()
    if db_vehicle is None:
        raise HTTPException(status_code=404, detail="not found id")
    db_vehicle.kind = vehicle.kind
    db_vehicle.model = vehicle.model
    db_vehicle.plate = vehicle.plate
    db_vehicle.date = vehicle.date
    db_vehicle.active = vehicle.active
    db.commit()
    return {"message": "successful update_vehicle"}

@router.patch("/vehicles/{id}")
def toggle_vehicle_active(id: int, vehicle: VehicleActiveSchema, db: Session = Depends(get_db)):
    query = select(Vehicle).where(Vehicle.vehicle_id==id)
    db_vehicle = db.execute(query).scalars().first()
    if db_vehicle is None:
        raise HTTPException(status_code=404, detail="not found id")
    db_vehicle.active = vehicle.active
    db.commit()
    return {"message": "successful toggle_vehicle"}





