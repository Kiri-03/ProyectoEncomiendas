from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from .dependencies import get_async_session
from .schemas import GPSUpdateSchema, CheckpointUpdateSchema
from datetime import datetime

router = APIRouter()

@router.post("/gps-ping")
async def receive_gps_ping(data: GPSUpdateSchema, db: AsyncSession = Depends(get_async_session)):
    return {"status": "recorded", "timestamp": datetime.utcnow()}

@router.post("/checkpoint-reach")
async def reach_checkpoint(data: CheckpointUpdateSchema, db: AsyncSession = Depends(get_async_session)):
    return {"status": "checkpoint_updated", "affected_items": len(data.encomienda_ids)}