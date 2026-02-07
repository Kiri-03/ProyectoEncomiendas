from pydantic import BaseModel
from datetime import datetime

class PaymentCreate(BaseModel):
    encomienda_id: str
    amount: float
    method: str

class PaymentRead(BaseModel):
    id: str
    encomienda_id: str
    amount: float
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True