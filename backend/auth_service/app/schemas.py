import uuid
from typing import Optional
from fastapi_users import schemas

class UserRead(schemas.BaseUser[uuid.UUID]):
    nombre: Optional[str]
    apellido: Optional[str]
    rol: str
    telefono: Optional[str]

class UserCreate(schemas.BaseUserCreate):
    nombre: str
    apellido: str
    rol: str = "empleado"
    telefono: Optional[str]

class UserUpdate(schemas.BaseUserUpdate):
    nombre: Optional[str]
    apellido: Optional[str]
    rol: Optional[str]
    telefono: Optional[str]