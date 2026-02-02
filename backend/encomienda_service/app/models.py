from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Enum, JSON
from sqlalchemy.orm import declarative_base
from datetime import datetime
import enum
import uuid

Base = declarative_base()

class EncomiendaStatus(enum.Enum):
    PENDIENTE = "pendiente"
    EN_CAMINO = "en_camino"
    ENTREGADO = "entregado"

class Office(Base):
    __tablename__ = "offices"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    city = Column(String, nullable=False)
    address = Column(String, nullable=False)

class Encomienda(Base):
    __tablename__ = "encomiendas"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    tracking_code = Column(String, unique=True, index=True)
    sender_id = Column(String, nullable=False)
    receiver_name = Column(String, nullable=False)
    receiver_phone = Column(String, nullable=False)
    
    origin_office_id = Column(String, ForeignKey("offices.id"))
    destination_office_id = Column(String, ForeignKey("offices.id"))
    
    items = Column(JSON, nullable=False) # Lista de items con peso y descripción
    subtotal = Column(Float, nullable=False)
    status = Column(Enum(EncomiendaStatus), default=EncomiendaStatus.PENDIENTE)
    
    created_at = Column(DateTime, default=datetime.utcnow)