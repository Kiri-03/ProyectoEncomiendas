from fastapi_users_db_sqlalchemy import SQLAlchemyBaseUserTableUUID
from sqlalchemy import String, Column, Enum, DateTime
from sqlalchemy.orm import declarative_base
from datetime import datetime
import enum

Base = declarative_base()

class UserRole(enum.Enum):
    ADMIN = "administrador"
    EMPLOYEE = "empleado"
    CLIENT = "cliente"
    DRIVER = "conductor"

class User(Base, SQLAlchemyBaseUserTableUUID):
    __tablename__ = "user"
    
    nombre = Column(String(100), nullable=False)
    apellido = Column(String(100), nullable=False)
    telefono = Column(String(20), nullable=False)
    rol = Column(Enum(UserRole), nullable=False, default=UserRole.CLIENT)
    fecha_registro = Column(DateTime, nullable=False, default=datetime.utcnow)