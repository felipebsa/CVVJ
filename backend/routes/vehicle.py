from fastapi import APIRouter, HTTPException
from models.vehicle import Vehicle
from schemas.vehicle import VehicleSchema
from database import SessionLocal

router = APIRouter()

@router.get("/")
def home():
    return {"message": "successful home"}

@router.get("/vehicle_id/{id}")
def get_vehicle_id(id: int):
    db = SessionLocal()
    db_vehicle = db.query(Vehicle).filter_by(vehicle_id=id).first()
    if db_vehicle is None:
        raise HTTPException(status_code=404, detail="not found id")
    db.close()
    return {"message": db_vehicle}

@router.get("/vehicle_active/{active}")
def get_vehicle_active(active: bool):
    db = SessionLocal()
    db_vehicles = db.query(Vehicle).filter_by(vehicle_active=active).all()
    if db_vehicles is None:
        raise HTTPException(status_code=404, detail="not vehicles actives")
    vehicles = []
    for db_vehicle in db_vehicles:
        vehicles.append(db_vehicle)
    db.close()
    return {"message": vehicles}

@router.post("/vehicles_register")
def post_vehicle(vehicle: VehicleSchema):
    db = SessionLocal()
    db_vehicle = vehicle(
        vehicle_type = vehicle.vehicle_type,
        vehicle_model = vehicle.vehicle_model,
        vehicle_date = vehicle.vehicle_date,
        vehicle_plate = vehicle.vehicle_plate,
        vehicle_active = vehicle.vehicle_active
    )
    db.add(db_vehicle)
    db.commit()
    db.close()
    return {"message": "successful post_vehicle"}

@router.delete("/vehicle_delete/{id}")
def delete_vehicle(id: int):
    db = SessionLocal()
    db_vehicle = db.query(Vehicle).filter_by(vehicle_id=id).first()
    if db_vehicle is None:
        raise HTTPException(status_code=404, detail="not found id")
    db.delete(db_vehicle)
    db.commit()
    db.close()
    return {"message": "successful delete_vehicle"}

@router.put("/vehicle_update/{id}")
def put_vehicle(id: int, Vehicle: VehicleSchema):
    db = SessionLocal()
    db_vehicle = db.query(Vehicle).filter_by(vehicle_id=id).first()
    if db_vehicle is None:
        raise HTTPException(status_code=404, detail="not found id")
    db_vehicle.vehicle_type = Vehicle.vehicle_type
    db_vehicle.vehicle_model = Vehicle.vehicle_model
    db_vehicle.vehicle_plate = Vehicle.vehicle_plate
    db_vehicle.vehicle_date = Vehicle.vehicle_date
    db_vehicle.vehicle_active = Vehicle.vehicle_active
    db.commit()
    db.close()
    return {"message": "successful put_vehicle"}





