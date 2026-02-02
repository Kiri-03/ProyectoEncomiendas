from fastapi import FastAPI
from fastapi_users import FastAPIUsers
from .db import User, create_db_and_tables
from .schemas import UserRead, UserCreate, UserUpdate
from .auth import auth_backend, get_user_manager

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