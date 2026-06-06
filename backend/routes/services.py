from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import select
from models.services import Service
from schemas.services import ServicesSchema
from database import get_db

router = APIRouter()

@router.get("/")
def home():
    return {"message:" "successful home"}

@router.get("/services/id/{id}")
def get_service(id: int, db: Session = Depends(get_db)):
    query = select(Service).where(Service.service_id==id)
    db_service = db.execute(query).scalars().first()
    if db_service is None:
        raise HTTPException(status_code=404, detail="service id not found")
    return {"message": db_service}

@router.get("services/finish/{finish}")
def get_finish_services(finish: bool, db: Session = Depends(get_db)):
    query = select(Service).where(Service.finish==finish)
    db_services = db.execute(query).scalars().all()
    if not db_services:
        raise HTTPException(status_code=404, detail="no have finish services")
    return {"message": db_services}

@router.post("/services/register")
def create_service(service: ServicesSchema, db: Session = Depends(get_db)):
    db_service = Service(
        title = service.title,
        desc = service.desc,
        date = service.date,
        labor_value = service.labor_value,
        parts_value = service.parts_value,
        parts_desc = service.parts_desc,
        finish = service.finish
    )
    db.add(db_service)
    db.commit()
    return {"message": "successful create_service"}

@router.delete("/services/delete/{id}")
def delete_service(id: int, db: Session = Depends(get_db)):
    query = select(Service).where(Service.service_id==id)
    db_service = db.execute(query).scalars().first()
    if db_service is None:
        raise HTTPException(status_code=404, detail="service id not found")
    db.delete(db_service)
    db.commit()
    return {"message": "successful delete_service"}

@router.post("/service/update/{id}")
def update_servie(id: int, service: ServicesSchema, db: Session = Depends(get_db)):
    query = select(Service).where(Service.service_id==id)
    db_service = db.execute(query).scalars().first()
    if db_service is None:
        raise HTTPException(status_code=404, detail="service id not found")
    db_service.title = service.title
    db_service.desc = service.desc
    db_service.date = service.date
    db_service.labor_value = service.labor_value
    db_service.parts_value = service.parts_value
    db_service.parts_desc = service.parts_desc
    db_service.finish = service.finish
    db.commit()
    return {"message": "successful update_service"}

@router.patch("/services/{id}")
def toggle_service_finish(id: int, service: ServicesSchema, db: Session = Depends(get_db)):
    query = select(Service).where(Service.service_id==id)
    db_service = db.execute(query).scalars().first()
    if db_service is None:
        raise HTTPException(status_code=404, detail="service id not found")
    db_service.finish = service.finish
    db.commit()
    return {"message": "successful toggle_service_finish"}


