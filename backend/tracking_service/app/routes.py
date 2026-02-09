from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, text
from .dependencies import get_async_session
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

class CheckpointSchema(BaseModel):
    id: str | None = None
    ruta_id: str | None = None
    nombre: str
    orden: int
    lat: float
    lng: float

class GPSUpdateSchema(BaseModel):
    bus_id: str
    latitude: float
    longitude: float
    speed: float

class CheckpointUpdateSchema(BaseModel):
    bus_id: str
    checkpoint_id: str
    encomienda_ids: List[str]

class TrackingStatus(BaseModel):
    tracking_code: str
    status: str
    location: str
    message: str
    timestamp: datetime

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

@router.get("/rutas/{ruta_id}", response_model=RutaSchema)
async def get_ruta(ruta_id: str, db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(text("SELECT id, origen, destino, duracion, precio_base, estado FROM rutas WHERE id = :id"), {"id": ruta_id})
    row = result.first()
    if not row:
        raise HTTPException(status_code=404, detail="Ruta no encontrada")
    return dict(row._mapping)

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
        {"id": "b1", "numero_disco": "045", "placa": "ABC-1234", "conductor": "Carlos Ruiz", "hora_salida": "14:00", "destino": "Guayaquil"},
        {"id": "b2", "numero_disco": "050", "placa": "XYZ-9876", "conductor": "Luis Gomez", "hora_salida": "14:30", "destino": "Cuenca"},
        {"id": "b3", "numero_disco": "012", "placa": "DEF-5678", "conductor": "Ana Torres", "hora_salida": "15:00", "destino": "Manta"},
        {"id": "b4", "numero_disco": "099", "placa": "GHI-9012", "conductor": "Pedro Diaz", "hora_salida": "16:00", "destino": "Guayaquil"},
    ]

@router.post("/gps-ping")
async def receive_gps_ping(data: GPSUpdateSchema, db: AsyncSession = Depends(get_async_session)):
    # Aquí se podría actualizar la ubicación en tiempo real de un bus
    # Por ahora solo registramos recepción
    return {"status": "recorded", "timestamp": datetime.utcnow()}

@router.post("/checkpoint-reach")
async def reach_checkpoint(data: CheckpointUpdateSchema, db: AsyncSession = Depends(get_async_session)):
    # Obtener nombre del checkpoint para el mensaje
    cp_result = await db.execute(text("SELECT nombre FROM checkpoints WHERE id = :id"), {"id": data.checkpoint_id})
    cp_row = cp_result.first()
    location_name = cp_row.nombre if cp_row else "Punto de Control"

    # Registrar evento para cada encomienda
    for tracking_code in data.encomienda_ids:
        event = TrackingEvent(
            tracking_code=tracking_code,
            status="en_transito",
            location=location_name,
            message=f"Unidad arribó a {location_name}",
            timestamp=datetime.utcnow()
        )
        db.add(event)
    await db.commit()
    return {"status": "checkpoint_updated", "affected_items": len(data.encomienda_ids)}

# Endpoints de Gestión de Checkpoints (Admin)
@router.get("/rutas/{ruta_id}/checkpoints", response_model=List[CheckpointSchema])
async def get_route_checkpoints(ruta_id: str, db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(
        text("SELECT id, ruta_id, nombre, orden, lat, lng FROM checkpoints WHERE ruta_id = :ruta_id ORDER BY orden ASC"),
        {"ruta_id": ruta_id}
    )
    return [dict(row._mapping) for row in result]

@router.post("/rutas/{ruta_id}/checkpoints", response_model=CheckpointSchema)
async def create_route_checkpoint(ruta_id: str, checkpoint: CheckpointSchema, db: AsyncSession = Depends(get_async_session)):
    new_id = str(uuid.uuid4())
    await db.execute(
        text("INSERT INTO checkpoints (id, ruta_id, nombre, orden, lat, lng) VALUES (:id, :ruta_id, :nombre, :orden, :lat, :lng)"),
        {"id": new_id, "ruta_id": ruta_id, "nombre": checkpoint.nombre, "orden": checkpoint.orden, "lat": checkpoint.lat, "lng": checkpoint.lng}
    )
    await db.commit()
    return {**checkpoint.dict(), "id": new_id, "ruta_id": ruta_id}

@router.delete("/checkpoints/{checkpoint_id}")
async def delete_route_checkpoint(checkpoint_id: str, db: AsyncSession = Depends(get_async_session)):
    await db.execute(text("DELETE FROM checkpoints WHERE id=:id"), {"id": checkpoint_id})
    await db.commit()
    return {"message": "Checkpoint eliminado"}

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

@router.get("/{tracking_code}/history", response_model=List[TrackingStatus])
async def get_tracking_history(tracking_code: str, db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(
        select(TrackingEvent).where(TrackingEvent.tracking_code == tracking_code).order_by(TrackingEvent.timestamp.desc())
    )
    return result.scalars().all()