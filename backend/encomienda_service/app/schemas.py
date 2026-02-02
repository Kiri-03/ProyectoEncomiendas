from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from .models import EncomiendaStatus

class BusSchema(BaseModel):
    id: str
    numero_disco: str
    placa: str

    class Config:
        from_attributes = True

class EncomiendaItemSchema(BaseModel):
    description: str
    weight: float
    type: str # 'sobre', 'caja', 'saco', etc.
    price: float

class EncomiendaCreate(BaseModel):
    sender_id: str
    receiver_name: str
    receiver_phone: str
    receiver_dni: Optional[str] = None
    origin_office_id: str
    destination_office_id: str
    bus_id: Optional[str] = None # Puede asignarse después del registro
    items: List[EncomiendaItemSchema]

class EncomiendaRead(BaseModel):
    id: str
    tracking_code: str
    status: EncomiendaStatus
    subtotal: float
    bus_id: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True