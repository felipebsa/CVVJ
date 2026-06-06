from pydantic import BaseModel
from typing import Optional

class ServicesSchema(BaseModel):
    vehicle_id: int
    title: str
    desc: str
    date: str
    labor_value: Optional[float]
    parts_value: Optional[float]
    parts_desc: Optional[str]
    finish: bool

class ServiceFinishSchema(BaseModel):
    finish: bool