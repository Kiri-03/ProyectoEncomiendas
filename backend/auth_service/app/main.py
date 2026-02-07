from fastapi import FastAPI, Depends
from fastapi_users import FastAPIUsers
from fastapi_users.authentication import JWTStrategy, AuthenticationBackend, BearerTransport
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from .manager import get_user_manager
from .models import User
from .schemas import UserRead, UserCreate, UserUpdate
from .database import get_async_session
import uuid

app = FastAPI(title="Auth Service - TransLog")

bearer_transport = BearerTransport(tokenUrl="auth/jwt/login")

def get_jwt_strategy() -> JWTStrategy:
    return JWTStrategy(secret="SECRET_KEY_CHANGE_ME_IN_PRODUCTION", lifetime_seconds=3600)

auth_backend = AuthenticationBackend(
    name="jwt",
    transport=bearer_transport,
    get_strategy=get_jwt_strategy,
)

fastapi_users = FastAPIUsers[User, uuid.UUID](
    get_user_manager,
    [auth_backend],
)

# Rutas configuradas para coincidir con el proxy del Gateway (/auth/...)
# Gateway envía /auth/login -> Auth Service recibe /login
app.include_router(
    fastapi_users.get_auth_router(auth_backend), prefix="/jwt", tags=["auth"]
)
app.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate), prefix="", tags=["auth"]
)
app.include_router(
    fastapi_users.get_users_router(UserRead, UserUpdate), prefix="/users", tags=["users"]
)

@app.get("/users", response_model=List[UserRead], tags=["users"])
async def list_users(
    db: AsyncSession = Depends(get_async_session),
    user: User = Depends(fastapi_users.current_user(active=True, superuser=True))
):
    result = await db.execute(select(User))
    return result.scalars().all()