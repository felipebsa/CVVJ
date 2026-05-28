from sqlalchemy.orm import Mapped, mapped_column, String
from database import Base

class Vehicle(Base):
    __tablename__ = "vehicles"

    vehicle_id: Mapped[int] = mapped_column(primary_key=True)
    vehicle_model: Mapped[str] = mapped_column(String(100))
    vehicle_type: Mapped[str] = mapped_column(String(100))
    vehicle_date: Mapped[str] = mapped_column(String(50))
    vehicle_plate: Mapped[str] = mapped_column(String(14))
    vehicle_active: Mapped[bool] = mapped_column(default=True)