from fastapi import APIRouter, Request, HTTPException
import httpx
import os

router = APIRouter()

# URLs de los microservicios (configurables por variables de entorno)
AUTH_SERVICE = os.getenv("AUTH_SERVICE_URL", "http://localhost:8001")
ENCOMIENDA_SERVICE = os.getenv("ENCOMIENDA_SERVICE_URL", "http://localhost:8002")
TRACKING_SERVICE = os.getenv("TRACKING_SERVICE_URL", "http://localhost:8003")
PAYMENT_SERVICE = os.getenv("PAYMENT_SERVICE_URL", "http://localhost:8004")

async def proxy_request(url: str, request: Request):
    """Función genérica para redirigir peticiones."""
    async with httpx.AsyncClient() as client:
        method = request.method
        content = await request.body()
        headers = dict(request.headers)
        # Eliminar el host original para evitar conflictos
        headers.pop("host", None)
        
        try:
            response = await client.request(
                method, url, content=content, headers=headers, params=request.query_params
            )
            return response.json(), response.status_code
        except Exception as e:
            raise HTTPException(status_code=503, detail=f"Service unavailable: {str(e)}")

@router.api_route("/auth/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def auth_proxy(path: str, request: Request):
    data, status = await proxy_request(f"{AUTH_SERVICE}/{path}", request)
    return data

@router.api_route("/encomiendas/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def encomienda_proxy(path: str, request: Request):
    data, status = await proxy_request(f"{ENCOMIENDA_SERVICE}/encomiendas/{path}", request)
    return data

@router.api_route("/tracking/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def tracking_proxy(path: str, request: Request):
    data, status = await proxy_request(f"{TRACKING_SERVICE}/tracking/{path}", request)
    return data

@router.api_route("/payments/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def payment_proxy(path: str, request: Request):
    data, status = await proxy_request(f"{PAYMENT_SERVICE}/payments/{path}", request)
    return data