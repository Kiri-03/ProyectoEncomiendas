from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from .database import get_async_session
from .models import Payment
from .schemas import PaymentCreate, PaymentRead
import uuid
from datetime import datetime

router = APIRouter()

@router.post("/process", response_model=PaymentRead)
async def process_payment(data: PaymentCreate, db: AsyncSession = Depends(get_async_session)):
    # Aquí se integraría con una pasarela real (Stripe, PayPal, etc.)
    # Por ahora registramos el pago como exitoso en nuestra BD
    new_payment = Payment(
        id=str(uuid.uuid4()),
        encomienda_id=data.encomienda_id,
        amount=data.amount,
        method=data.method,
        status="completed",
        created_at=datetime.utcnow()
    )
    
    db.add(new_payment)
    await db.commit()
    await db.refresh(new_payment)
    return new_payment

@router.get("/history/{encomienda_id}")
async def get_payment_history(encomienda_id: str, db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(select(Payment).where(Payment.encomienda_id == encomienda_id))
    return result.scalars().all()