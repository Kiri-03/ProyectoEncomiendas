from fastapi import APIRouter, Depends
from pydantic import BaseModel
from .models import PaymentMethod, PaymentStatus

router = APIRouter()

class PaymentCreate(BaseModel):
    encomienda_id: str
    amount: float
    method: PaymentMethod
    reference: str = None

@router.post("/process")
async def process_payment(data: PaymentCreate):
    # Lógica de integración con pasarela (Stripe, Kushki, etc.)
    # O registro de pago en efectivo en ventanilla
    return {
        "payment_id": "pay_998877",
        "status": PaymentStatus.COMPLETED,
        "message": "Pago procesado exitosamente"
    }

@router.get("/verify/{encomienda_id}")
async def verify_payment_status(encomienda_id: str):
    return {"encomienda_id": encomienda_id, "is_paid": True, "status": "completed"}