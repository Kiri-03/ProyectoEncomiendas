from sqlalchemy import Column, String, Float, DateTime, Integer
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Encomienda(Base):
    __tablename__ = "encomiendas"
    
    id = Column(String, primary_key=True, index=True)
    tracking_code = Column(String, unique=True, index=True)
    remitente_nombre = Column(String)
    destinatario_nombre = Column(String)
    destino_direccion = Column(String)
    peso = Column(Float)
    tipo = Column(String)
    status = Column(String, default="en_bodega_origen")
    subtotal = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)