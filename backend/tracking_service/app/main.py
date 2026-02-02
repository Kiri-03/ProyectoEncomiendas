from fastapi import FastAPI
from .routes import router

app = FastAPI(title="Tracking Service - TransLog")

app.include_router(router, prefix="/tracking", tags=["tracking"])

@app.get("/health")
async def health():
    return {"status": "ok", "service": "tracking-service"}