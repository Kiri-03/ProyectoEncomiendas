from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
	ENCOMIENDA_DATABASE_URL: str = "postgresql+asyncpg://user:pass@localhost/encomienda_db"

settings = Settings()
DATABASE_URL = settings.ENCOMIENDA_DATABASE_URL

engine = create_async_engine(DATABASE_URL, echo=True)
async_session_maker = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)