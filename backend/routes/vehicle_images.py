from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import select
from models.vehicle import Vehicle
from models.vehicle_images import Images
from schemas.vehicle_images import SchemaVehicle_Image
from database import get_db
import uuid
import os

router = APIRouter()

@router.get("/")
def images_home():
    return {"message": "successful home"}

@router.get("/vehicle_images/id/{id}")
def get_image(id: int, db: Session = Depends(get_db)):
    query = select(Images).where(Images.image_id==id)
    db_image = db.execute(query).scalars().first()
    if db_image is None:
        raise HTTPException(status_code=404, detail="not found image id")
    return {"message": db_image}

@router.get("/vehicle_images/vehicle/{id}")
def get_all_images(id: int, db: Session = Depends(get_db)):
    query = select(Images).where(Images.vehicle_id==id)
    db_images = db.execute(query).scalars().all()
    if not db_images:
        raise HTTPException(status_code=404, detail="not found vehicle id")
    return {"message": db_images}

@router.post("/vehicle_images/register")
def create_image(images: SchemaVehicle_Image, db: Session = Depends(get_db)):
    query = select(Vehicle).where(Vehicle.vehicle_id==images.vehicle_id)
    get_query = db.execute(query).scalars().first()
    if get_query is None:
        raise HTTPException(status_code=404, detail="not found vehicle id")
    db_image = Images(
        vehicle_id = images.vehicle_id,
        image_path = images.image_path
    )
    db.add(db_image)
    db.commit()
    return {"message": "successful create_image"}

@router.delete("/vehicle_images/delete/{id}")
def delete_image(id: int, db: Session = Depends(get_db)):
    query = select(Images).where(Images.image_id==id)
    db_image = db.execute(query).scalars().first()
    if db_image is None:
        raise HTTPException(status_code=404, detail="not found id")
    
    # remove file in disk
    if os.path.exists(db_image.image_path):
        os.remove(db_image.image_path)
    
    db.delete(db_image)
    db.commit()
    return {"message": "successful delete_image"}

#imagem path

@router.post("/vehicle_images/upload/{vehicle_id}")
async def upload_image(vehicle_id: int, file: UploadFile = File(), db: Session = Depends(get_db)):
    unique_name = f"{uuid.uuid4()}_{file.filename}"
    contents = await file.read()
    with open(f"uploads/{unique_name}", "wb") as f:
        f.write(contents)
    query = select(Vehicle).where(Vehicle.vehicle_id==vehicle_id)
    get_query = db.execute(query).scalars().first()
    if get_query is None:
        raise HTTPException(status_code=404, detail="not found vehicle id")
    db_image = Images(
        vehicle_id = vehicle_id,
        image_path = f"uploads/{unique_name}"
    )
    db.add(db_image)
    db.commit()
    return {"message": db_image}