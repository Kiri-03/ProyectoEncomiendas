from sqlalchemy import Column, String, Integer, DateTime, Float
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class TrackingEvent(Base):
    __tablename__ = "tracking_events"
    id = Column(Integer, primary_key=True, index=True)
    tracking_code = Column(String, index=True)
    status = Column(String)
    location = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
    message = Column(String)