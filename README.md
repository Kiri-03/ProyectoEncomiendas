# Endpoints principales

## Backend
- `/api/auth/login`: Autenticación de usuarios
- `/api/encomiendas`: Gestión de encomiendas
- `/api/tracking`: Rastreo de encomiendas
- `/api/payments`: Procesamiento de pagos

## Frontend
- Rutas protegidas por roles y autenticación
- Gestión de usuarios, encomiendas, rutas y rastreo

## Documentación automática
- FastAPI genera documentación en `/docs` para cada microservicio

## Variables de entorno
- Backend: Usa pydantic BaseSettings para cargar variables sensibles (ver ejemplo en `encomienda_service/app/database.py`).
- Frontend: Usa archivos `.env` y accede a variables con `import.meta.env` (ver ejemplo en `src/lib/api-client.ts`).
# Welcome to your Dyad app
