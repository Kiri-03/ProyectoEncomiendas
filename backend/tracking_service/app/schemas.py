from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class GPSUpdateSchema(BaseModel):
    bus_id: str
    latitude: float
    longitude: float
    speed: Optional[float] = None

class CheckpointUpdateSchema(BaseModel):
    bus_id: str
    checkpoint_id: str
    encomienda_ids: List[str]

class RouteRead(BaseModel):
    id: str
    name: str
    origin: str
    destination: str

    class Config:
        from_attributes = True