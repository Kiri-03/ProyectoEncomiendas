from fastapi import FastAPI, Depends, HTTPException
from typing import List
from .schemas import EncomiendaCreate, EncomiendaRead
from .models import Encomienda

app = FastAPI(title="Encomienda Service - TransLog")

@app.post("/encomiendas/", response_model=EncomiendaRead)
async def create_encomienda(encomienda: EncomiendaCreate):
    # Lógica para calcular subtotal basado en peso y tipo
    # Lógica para asignar oficina de origen (basado en el empleado)
    # Lógica para generar código de seguimiento único
    return {"status": "created", "data": encomienda}

@app.get("/encomiendas/{tracking_code}")
async def get_encomienda(tracking_code: str):
    # Búsqueda en Postgres
    return {"tracking_code": tracking_code, "status": "en_oficina"}