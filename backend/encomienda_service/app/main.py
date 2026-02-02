from fastapi import FastAPI
from .routes import router

app = FastAPI(title="Encomienda Service - TransLog")

app.include_router(router, prefix="/encomiendas", tags=["encomiendas"])

@router.get("/health")
async def health():
    return {"status": "ok", "service": "encomienda-service"}