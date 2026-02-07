from fastapi_users.db import SQLAlchemyBaseUserTableUUID
from sqlalchemy import Column, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(SQLAlchemyBaseUserTableUUID, Base):
    nombre = Column(String, nullable=True)
    apellido = Column(String, nullable=True)
    rol = Column(String, default="empleado")
    telefono = Column(String, nullable=True)