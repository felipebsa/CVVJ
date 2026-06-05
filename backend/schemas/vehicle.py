from pydantic import BaseModel

class VehicleSchema(BaseModel):
    vehicle_type: str
    vehicle_model: str
    vehicle_date: str
    vehicle_plate: str
    vehicle_active: bool

class Active_VehicleSchema(BaseModel):
    vehicle_active: bool