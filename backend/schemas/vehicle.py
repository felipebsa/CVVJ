from pydantic import BaseModel

class VehicleSchema(BaseModel):
    kind: str
    model: str
    date: str
    plate: str
    active: bool

class VehicleActiveSchema(BaseModel):
    active: bool