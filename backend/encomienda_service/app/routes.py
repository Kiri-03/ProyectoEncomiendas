from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from .dependencies import get_async_session
from .schemas import EncomiendaCreate, EncomiendaRead, BusSchema
from .models import Encomienda, Bus, EncomiendaStatus
import uuid

router = APIRouter()

@router.post("/", response_model=EncomiendaRead)
async def create_encomienda(data: EncomiendaCreate, db: AsyncSession = Depends(get_async_session)):
    # Generar código de guía (formato cooperativa: DISCO-SEC-RANDOM)
    tracking_code = f"TL-{uuid.uuid4().hex[:6].upper()}"
    subtotal = sum(item.price for item in data.items)
    
    # En un entorno real, aquí guardaríamos en la DB
    return {
        "id": str(uuid.uuid4()),
        "tracking_code": tracking_code,
        "status": EncomiendaStatus.EN_BODEGA_ORIGEN,
        "subtotal": subtotal,
        "bus_id": data.bus_id,
        "created_at": datetime.utcnow()
    }

@router.patch("/{encomienda_id}/despachar")
async def despachar_encomienda(encomienda_id: str, bus_id: str, db: AsyncSession = Depends(get_async_session)):
    # Lógica para subir la encomienda al bus y cambiar estado a EN_TRANSITO
    return {"message": f"Encomienda {encomienda_id} despachada en bus {bus_id}"}

@router.get("/buses", response_model=List[BusSchema])
async def get_available_buses(db: AsyncSession = Depends(get_async_session)):
    # Retornar la flota de la cooperativa
    return [
        {"id": "b1", "numero_disco": "045", "placa": "ABC-1234"},
        {"id": "b2", "numero_disco": "102", "placa": "XYZ-9876"}
    ]