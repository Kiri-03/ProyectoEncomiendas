from fastapi import FastAPI
from .routes import router

app = FastAPI(title="Payment Service - TransLog")

app.include_router(router, tags=["payments"])

@app.get("/health")
async def health():
    return {"status": "ok", "service": "payment-service"}