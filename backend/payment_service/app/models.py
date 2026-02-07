from sqlalchemy import Column, String, Float, DateTime, Integer
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Payment(Base):
    __tablename__ = "payments"
    
    id = Column(String, primary_key=True, index=True)
    encomienda_id = Column(String, index=True)
    amount = Column(Float)
    method = Column(String) # efectivo, tarjeta, transferencia
    status = Column(String, default="completed")
    created_at = Column(DateTime, default=datetime.utcnow)