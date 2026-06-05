from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String
from database import Base


class Vehicle(Base):
    __tablename__ = "vehicles"

    vehicle_id: Mapped[int] = mapped_column(primary_key=True)
    model: Mapped[str] = mapped_column(String(100))
    kind: Mapped[str] = mapped_column(String(100))
    date: Mapped[str] = mapped_column(String(50))
    plate: Mapped[str] = mapped_column(String(8))
    active: Mapped[bool] = mapped_column(default=True)

