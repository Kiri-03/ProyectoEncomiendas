from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from .dependencies import get_async_session
from .schemas import EncomiendaCreate, EncomiendaRead
from .models import Encomienda
import uuid

router = APIRouter()

@router.post("/", response_model=EncomiendaRead)
async def create_encomienda(data: EncomiendaCreate, db: AsyncSession = Depends(get_async_session)):
    # Lógica simplificada para el ejemplo
    tracking_code = f"TRK-{uuid.uuid4().hex[:8].upper()}"
    subtotal = sum(item.price for item in data.items)
    
    # Aquí iría la lógica de guardado en DB
    return {
        "id": str(uuid.uuid4()),
        "tracking_code": tracking_code,
        "status": "pendiente",
        "subtotal": subtotal,
        "created_at": "2024-03-20T10:00:00"
    }

@router.get("/{tracking_code}", response_model=EncomiendaRead)
async def get_encomienda(tracking_code: str, db: AsyncSession = Depends(get_async_session)):
    # Lógica de búsqueda en DB
    return {
        "id": "some-id",
        "tracking_code": tracking_code,
        "status": "en_camino",
        "subtotal": 25.0,
        "created_at": "2024-03-20T10:00:00"
    }