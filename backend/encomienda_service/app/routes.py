from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from .dependencies import get_async_session
from .schemas import EncomiendaCreate, EncomiendaRead, EncomiendaStatusUpdate
from .models import Encomienda
import uuid
from datetime import datetime
from typing import List

router = APIRouter()

@router.post("/", response_model=EncomiendaRead)
async def create_encomienda(data: EncomiendaCreate, db: AsyncSession = Depends(get_async_session)):
    # Generar código de guía (formato cooperativa: DISCO-SEC-RANDOM)
    tracking_code = f"TL-{uuid.uuid4().hex[:6].upper()}"
    # Calculo simple de subtotal
    subtotal = data.peso * 2.5  # Ejemplo: $2.5 por kg
    
    new_encomienda = Encomienda(
        id=str(uuid.uuid4()),
        tracking_code=tracking_code,
        remitente_nombre=data.remitente_nombre,
        destinatario_nombre=data.destinatario_nombre,
        destino_direccion=data.destino_direccion,
        peso=data.peso,
        tipo=data.tipo,
        status="en_bodega_origen",
        subtotal=subtotal,
        created_at=datetime.utcnow()
    )
    
    db.add(new_encomienda)
    await db.commit()
    await db.refresh(new_encomienda)
    return new_encomienda

@router.get("/", response_model=List[EncomiendaRead])
async def read_encomiendas(db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(select(Encomienda))
    return result.scalars().all()

@router.patch("/{encomienda_id}/despachar")
async def despachar_encomienda(encomienda_id: str, bus_id: str, db: AsyncSession = Depends(get_async_session)):
    # Lógica para subir la encomienda al bus y cambiar estado a EN_TRANSITO
    # Implementación pendiente de lógica de negocio real
    return {"message": f"Encomienda {encomienda_id} despachada en bus {bus_id} (Simulado)"}

@router.patch("/{encomienda_id}/status", response_model=EncomiendaRead)
async def update_status(encomienda_id: str, status_data: EncomiendaStatusUpdate, db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(select(Encomienda).where(Encomienda.id == encomienda_id))
    encomienda = result.scalar_one_or_none()
    if not encomienda:
        raise HTTPException(status_code=404, detail="Encomienda no encontrada")
    
    encomienda.status = status_data.status
    await db.commit()
    await db.refresh(encomienda)
    return encomienda

@router.get("/stats/dashboard")
async def get_dashboard_stats(db: AsyncSession = Depends(get_async_session)):
    # Obtener todas las encomiendas para calcular estadísticas
    # Nota: En producción esto debería hacerse con consultas SQL agregadas (GROUP BY)
    result = await db.execute(select(Encomienda))
    encomiendas = result.scalars().all()
    
    total_revenue = sum(e.subtotal for e in encomiendas)
    total_shipments = len(encomiendas)
    active_shipments = sum(1 for e in encomiendas if e.status == "en_transito")
    delivered_shipments = sum(1 for e in encomiendas if e.status == "entregado")
    
    # Datos simulados para gráficos (se podrían calcular real con fechas)
    revenue_data = [
        {"name": "Lun", "total": total_revenue * 0.1},
        {"name": "Mar", "total": total_revenue * 0.15},
        {"name": "Mie", "total": total_revenue * 0.12},
        {"name": "Jue", "total": total_revenue * 0.2},
        {"name": "Vie", "total": total_revenue * 0.25},
        {"name": "Sab", "total": total_revenue * 0.18},
        {"name": "Dom", "total": 0},
    ]

    return {
        "revenue": total_revenue,
        "total_shipments": total_shipments,
        "active_shipments": active_shipments,
        "delivered_shipments": delivered_shipments,
        "revenue_chart": revenue_data
    }

@router.get("/terminals")
async def get_terminals(db: AsyncSession = Depends(get_async_session)):
    # Retorna lista de terminales disponibles (Simulado o de BD)
    return [
        {"id": "t1", "nombre": "Terminal Terrestre Quitumbe (Quito)", "ciudad": "Quito"},
        {"id": "t2", "nombre": "Terminal Terrestre Guayaquil", "ciudad": "Guayaquil"},
        {"id": "t3", "nombre": "Terminal Terrestre Cuenca", "ciudad": "Cuenca"},
        {"id": "t4", "nombre": "Terminal Terrestre Manta", "ciudad": "Manta"},
    ]

@router.get("/{tracking_code}", response_model=EncomiendaRead)
async def get_encomienda(tracking_code: str, db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(select(Encomienda).where(Encomienda.tracking_code == tracking_code))
    encomienda = result.scalar_one_or_none()
    if not encomienda:
        raise HTTPException(status_code=404, detail="Encomienda no encontrada")
    return encomienda