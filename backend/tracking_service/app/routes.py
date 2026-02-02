from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

class GPSUpdate(BaseModel):
    bus_id: str
    latitude: float
    longitude: float
    speed: Optional[float] = None

class CheckpointUpdate(BaseModel):
    bus_id: str
    checkpoint_id: str
    encomienda_ids: List[str] # IDs de encomiendas que se descargan/cargan aquí

@router.post("/gps-ping")
async def receive_gps_ping(data: GPSUpdate):
    """Endpoint para que la app móvil envíe coordenadas en segundo plano."""
    return {"status": "recorded", "timestamp": datetime.utcnow()}

@router.post("/checkpoint-reach")
async def reach_checkpoint(data: CheckpointUpdate):
    """Endpoint para que el conductor marque llegada a un punto de control."""
    return {"status": "checkpoint_updated", "affected_items": len(data.encomienda_ids)}

@router.get("/bus/{bus_id}/active-encomiendas")
async def get_bus_load(bus_id: str):
    """Retorna la lista de carga para que el conductor sepa qué lleva."""
    return [
        {"id": "enc_1", "code": "TL-A1B2", "destinatario": "Juan Perez", "destino": "Guayaquil"},
        {"id": "enc_2", "code": "TL-C3D4", "destinatario": "Maria Loor", "destino": "Santo Domingo"}
    ]