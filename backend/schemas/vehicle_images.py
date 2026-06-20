from pydantic import BaseModel

class SchemaVehicle_Image(BaseModel):
    vehicle_id: int
    image_path: str