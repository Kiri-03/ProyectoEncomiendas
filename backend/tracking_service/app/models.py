from sqlalchemy import Column, String, Float, Integer, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from .database import Base
from datetime import datetime
import uuid

class TrackingEvent(Base):
    __tablename__ = "tracking_events"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    tracking_code = Column(String(50), index=True)
    status = Column(String(50))
    location = Column(String(100))
    message = Column(String(255))
    timestamp = Column(DateTime, default=datetime.utcnow)

class Ruta(Base):
    __tablename__ = "rutas"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    origen = Column(String(100), nullable=False)
    destino = Column(String(100), nullable=False)
    duracion = Column(String(50))
    precio_base = Column(Float)
    estado = Column(String(20), default="activa")

    checkpoints = relationship("Checkpoint", back_populates="ruta", cascade="all, delete-orphan")

class Checkpoint(Base):
    __tablename__ = "checkpoints"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    ruta_id = Column(String(36), ForeignKey("rutas.id", ondelete="CASCADE"))
    nombre = Column(String(100), nullable=False)
    orden = Column(Integer)
    lat = Column(Float)
    lng = Column(Float)

    ruta = relationship("Ruta", back_populates="checkpoints")