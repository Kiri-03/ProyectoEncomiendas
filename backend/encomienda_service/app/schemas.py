from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from .models import EncomiendaStatus

class EncomiendaItemSchema(BaseModel):
    description: str
    weight: float
    type: str
    price: float

class EncomiendaCreate(BaseModel):
    sender_id: str
    receiver_name: str
    receiver_phone: str
    origin_office_id: str
    destination_office_id: str
    items: List[EncomiendaItemSchema]

class EncomiendaRead(BaseModel):
    id: str
    tracking_code: str
    status: EncomiendaStatus
    subtotal: float
    created_at: datetime

    class Config:
        from_attributes = True