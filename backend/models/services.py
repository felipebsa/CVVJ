from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import ForeignKey
from database import Base
from typing import Optional


class Service(Base):
    __tablename__ = "services"

    service_id: Mapped[int] = mapped_column(primary_key=True)
    vehicle_id: Mapped[int] = mapped_column(ForeignKey("vehicles.vehicle_id"))
    title: Mapped[str] = mapped_column()
    desc: Mapped[str] = mapped_column()
    date: Mapped[str] = mapped_column()
    labor_value: Mapped[Optional[float]] = mapped_column()
    parts_value: Mapped[Optional[float]] = mapped_column()
    parts_desc: Mapped[Optional[str]] = mapped_column()
    finish: Mapped[bool] = mapped_column(default=False)