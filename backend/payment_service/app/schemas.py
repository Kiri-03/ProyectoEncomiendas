from pydantic import BaseModel
from .models import PaymentMethod, PaymentStatus
from datetime import datetime
from typing import Optional

class PaymentCreate(BaseModel):
    encomienda_id: str
    amount: float
    method: PaymentMethod
    reference: Optional[str] = None

class PaymentRead(BaseModel):
    id: str
    encomienda_id: str
    amount: float
    status: PaymentStatus
    created_at: datetime

    class Config:
        from_attributes = True