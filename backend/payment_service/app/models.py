from sqlalchemy import Column, String, Float, DateTime, Enum, ForeignKey
from sqlalchemy.orm import declarative_base
from datetime import datetime
import enum

Base = declarative_base()

class PaymentMethod(enum.Enum):
    CASH = "efectivo"
    CREDIT_CARD = "tarjeta_credito"
    TRANSFER = "transferencia"
    MOBILE_WALLET = "billetera_movil"

class PaymentStatus(enum.Enum):
    PENDING = "pendiente"
    COMPLETED = "completado"
    FAILED = "fallido"
    REFUNDED = "reembolsado"

class Payment(Base):
    __tablename__ = "payments"
    
    id = Column(String, primary_key=True)
    encomienda_id = Column(String, nullable=False, index=True)
    amount = Column(Float, nullable=False)
    currency = Column(String, default="USD")
    method = Column(Enum(PaymentMethod), nullable=False)
    status = Column(Enum(PaymentStatus), default=PaymentStatus.PENDING)
    
    transaction_reference = Column(String, nullable=True) # ID de pasarela o num transferencia
    verification_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)