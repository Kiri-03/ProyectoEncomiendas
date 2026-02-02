from fastapi import FastAPI, Depends
from fastapi_users import FastAPIUsers
from .models import User
from .schemas import UserRead, UserCreate, UserUpdate
from .db import create_db_and_tables, get_async_session
from .auth import auth_backend, get_user_manager # Asumiendo que auth.py existe con la lógica de JWT y UserManager

app = FastAPI(title="Auth Service - TransLog")

fastapi_users = FastAPIUsers[User, int](
    get_user_manager,
    [auth_backend],
)

app.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix="/auth/jwt",
    tags=["auth"],
)

app.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix="/auth",
    tags=["auth"],
)

@app.on_event("startup")
async def on_startup():
    await create_db_and_tables()