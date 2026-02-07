from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class EncomiendaBase(BaseModel):
    remitente_nombre: str
    destinatario_nombre: str
    destino_direccion: str
    peso: float
    tipo: str

class EncomiendaCreate(EncomiendaBase):
    pass

class EncomiendaRead(EncomiendaBase):
    id: str
    tracking_code: str
    status: str
    subtotal: float
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class BusSchema(BaseModel):
    id: str
    numero_disco: str
    placa: str
    
    class Config:
        from_attributes = True

class EncomiendaStatusUpdate(BaseModel):
    status: str