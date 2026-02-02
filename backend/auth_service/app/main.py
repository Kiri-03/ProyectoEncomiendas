from fastapi import FastAPI
from .routes import router

app = FastAPI(title="Auth Service - TransLog")

app.include_router(router)

@app.on_event("startup")
async def on_startup():
    # Lógica de inicio (ej. verificar conexión DB)
    pass