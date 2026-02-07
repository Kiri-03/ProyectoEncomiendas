from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, text
from .dependencies import get_async_session
from .schemas import GPSUpdateSchema, CheckpointUpdateSchema, TrackingStatus
from .models import TrackingEvent
from datetime import datetime
from typing import List
import uuid
from pydantic import BaseModel

class RutaSchema(BaseModel):
    id: str | None = None
    origen: str
    destino: str
    duracion: str
    precio_base: float
    estado: str = "activa"

router = APIRouter()

# Endpoints de Rutas (Movidos desde Encomienda Service)
@router.get("/rutas", response_model=List[RutaSchema])
async def get_rutas(db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(text("SELECT id, origen, destino, duracion, precio_base, estado FROM rutas"))
    return [dict(row._mapping) for row in result]

@router.post("/rutas", response_model=RutaSchema)
async def create_ruta(ruta: RutaSchema, db: AsyncSession = Depends(get_async_session)):
    new_id = str(uuid.uuid4())
    await db.execute(
        text("INSERT INTO rutas (id, origen, destino, duracion, precio_base, estado) VALUES (:id, :origen, :destino, :duracion, :precio, :estado)"),
        {"id": new_id, "origen": ruta.origen, "destino": ruta.destino, "duracion": ruta.duracion, "precio": ruta.precio_base, "estado": ruta.estado}
    )
    await db.commit()
    return {**ruta.dict(), "id": new_id}

@router.put("/rutas/{ruta_id}")
async def update_ruta(ruta_id: str, ruta: RutaSchema, db: AsyncSession = Depends(get_async_session)):
    await db.execute(
        text("UPDATE rutas SET origen=:origen, destino=:destino, duracion=:duracion, precio_base=:precio, estado=:estado WHERE id=:id"),
        {"id": ruta_id, "origen": ruta.origen, "destino": ruta.destino, "duracion": ruta.duracion, "precio": ruta.precio_base, "estado": ruta.estado}
    )
    await db.commit()
    return {"message": "Ruta actualizada"}

@router.delete("/rutas/{ruta_id}")
async def delete_ruta(ruta_id: str, db: AsyncSession = Depends(get_async_session)):
    await db.execute(text("DELETE FROM rutas WHERE id=:id"), {"id": ruta_id})
    await db.commit()
    return {"message": "Ruta eliminada"}

@router.get("/buses")
async def get_buses():
    # Simulación de API externa de flota
    return [
        {"id": "b1", "numero_disco": "045", "placa": "ABC-1234", "conductor": "Carlos Ruiz"},
        {"id": "b2", "numero_disco": "050", "placa": "XYZ-9876", "conductor": "Luis Gomez"},
        {"id": "b3", "numero_disco": "012", "placa": "DEF-5678", "conductor": "Ana Torres"},
    ]

@router.post("/gps-ping")
async def receive_gps_ping(data: GPSUpdateSchema, db: AsyncSession = Depends(get_async_session)):
    # Aquí se podría actualizar la ubicación en tiempo real de un bus
    # Por ahora solo registramos recepción
    return {"status": "recorded", "timestamp": datetime.utcnow()}

@router.post("/checkpoint-reach")
async def reach_checkpoint(data: CheckpointUpdateSchema, db: AsyncSession = Depends(get_async_session)):
    # Registrar evento para cada encomienda
    for tracking_code in data.encomienda_ids:
        event = TrackingEvent(
            tracking_code=tracking_code,
            status="en_transito",
            location=f"Checkpoint {data.checkpoint_id}",
            message="Paquete arribó a punto de control",
            timestamp=datetime.utcnow()
        )
        db.add(event)
    await db.commit()
    return {"status": "checkpoint_updated", "affected_items": len(data.encomienda_ids)}

@router.get("/{tracking_code}", response_model=TrackingStatus)
async def get_tracking_info(tracking_code: str, db: AsyncSession = Depends(get_async_session)):
    # Obtener el último evento
    result = await db.execute(
        select(TrackingEvent).where(TrackingEvent.tracking_code == tracking_code).order_by(TrackingEvent.timestamp.desc())
    )
    event = result.scalars().first()
    
    if not event:
        raise HTTPException(status_code=404, detail="Información de rastreo no encontrada")
        
    return event