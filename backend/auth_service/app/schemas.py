from fastapi_users import schemas
from uuid import UUID
from datetime import datetime
from typing import Optional
from .models import UserRole

class UserRead(schemas.BaseUser[UUID]):
    nombre: str
    apellido: str
    telefono: str
    rol: UserRole
    fecha_registro: datetime

    class Config:
        from_attributes = True

class UserCreate(schemas.BaseUserCreate):
    nombre: str
    apellido: str
    telefono: str
    rol: Optional[UserRole] = UserRole.CLIENT

class UserUpdate(schemas.BaseUserUpdate):
    nombre: Optional[str] = None
    apellido: Optional[str] = None
    telefono: Optional[str] = None
    rol: Optional[UserRole] = None