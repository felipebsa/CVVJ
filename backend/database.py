from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

engine = create_engine("sqlite:///database.db")

class Base(DeclarativeBase):
    pass

SessionLocal = sessionmaker(bind=engine)
