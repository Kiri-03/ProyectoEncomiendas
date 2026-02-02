from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from .dependencies import get_async_session
from .schemas import PaymentCreate, PaymentRead
from .models import PaymentStatus
import uuid

router = APIRouter()

@router.post("/process", response_model=PaymentRead)
async def process_payment(data: PaymentCreate, db: AsyncSession = Depends(get_async_session)):
    return {
        "id": str(uuid.uuid4()),
        "encomienda_id": data.encomienda_id,
        "amount": data.amount,
        "status": PaymentStatus.COMPLETED,
        "created_at": datetime.utcnow()
    }