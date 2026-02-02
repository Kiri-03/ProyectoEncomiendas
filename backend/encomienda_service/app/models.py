from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Enum, JSON, Integer
from sqlalchemy.orm import declarative_base
from datetime import datetime
import enum
import uuid

Base = declarative_base()

class EncomiendaStatus(enum.Enum):
    EN_BODEGA_ORIGEN = "en_bodega_origen"
    EN_TRANSITO = "en_transito"
    EN_BODEGA_DESTINO = "en_bodega_destino"
    ENTREGADO = "entregado"
    DEVUELTO = "devuelto"

class Bus(Base):
    __tablename__ = "buses"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    numero_disco = Column(String, unique=True, nullable=False) # Ej: "Disco 45"
    placa = Column(String, unique=True, nullable=False)
    capacidad_carga_kg = Column(Float, default=100.0)
    conductor_id = Column(String, nullable=True) # Referencia al ID de usuario en auth_service

class Office(Base):
    __tablename__ = "offices"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False) # Ej: "Terminal Quitumbe"
    city = Column(String, nullable=False)
    address = Column(String, nullable=False)

class Encomienda(Base):
    __tablename__ = "encomiendas"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    tracking_code = Column(String, unique=True, index=True)
    
    # Datos de personas
    sender_id = Column(String, nullable=False)
    receiver_name = Column(String, nullable=False)
    receiver_phone = Column(String, nullable=False)
    receiver_dni = Column(String, nullable=True)
    
    # Logística de Cooperativa
    origin_office_id = Column(String, ForeignKey("offices.id"))
    destination_office_id = Column(String, ForeignKey("offices.id"))
    bus_id = Column(String, ForeignKey("buses.id"), nullable=True) # El bus asignado para el viaje
    
    items = Column(JSON, nullable=False) # [{desc, peso, tipo, precio}]
    subtotal = Column(Float, nullable=False)
    status = Column(Enum(EncomiendaStatus), default=EncomiendaStatus.EN_BODEGA_ORIGEN)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    fecha_despacho = Column(DateTime, nullable=True) # Cuando se sube al bus