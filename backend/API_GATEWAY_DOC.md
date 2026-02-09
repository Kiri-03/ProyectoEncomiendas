# Documentación de Endpoints del API Gateway

Este documento describe los endpoints expuestos por el API Gateway para acceder a los microservicios de autenticación (auth_service) y tracking (tracking_service), incluyendo rutas, métodos, bodys y ejemplos de request/response.

---

## 1. Endpoints de Autenticación (Auth Service)

Todos los endpoints de autenticación se acceden vía:

```
/auth/{path}
```

Ejemplo para login:

### POST /auth/jwt/login

**Request:**
```json
{
  "username": "usuario1",
  "password": "tu_contraseña"
}
```
**Response:**
```json
{
  "access_token": "<jwt_token>",
  "token_type": "bearer"
}
```

### GET /auth/users/me

**Headers:**
```
Authorization: Bearer <jwt_token>
```
**Response:**
```json
{
  "id": 1,
  "username": "usuario1",
  "email": "usuario1@email.com",
  "role": "user"
}
```

---

## 2. Endpoints de Tracking (Tracking Service)

Todos los endpoints de tracking se acceden vía:

```
/tracking/{path}
```

### Rutas

#### GET /tracking/rutas
Lista todas las rutas.

**Response:**
```json
[
  {
    "id": "uuid",
    "origen": "Ciudad A",
    "destino": "Ciudad B",
    "duracion": "3h",
    "precio_base": 10.5,
    "estado": "activa"
  }
]
```

#### POST /tracking/rutas
Crea una nueva ruta.

**Request:**
```json
{
  "origen": "Ciudad A",
  "destino": "Ciudad B",
  "duracion": "3h",
  "precio_base": 10.5,
  "estado": "activa"
}
```
**Response:**
```json
{
  "id": "uuid",
  "origen": "Ciudad A",
  "destino": "Ciudad B",
  "duracion": "3h",
  "precio_base": 10.5,
  "estado": "activa"
}
```

#### PUT /tracking/rutas/{ruta_id}
Actualiza una ruta existente.

**Request:**
```json
{
  "origen": "Ciudad A",
  "destino": "Ciudad B",
  "duracion": "3h",
  "precio_base": 12.0,
  "estado": "activa"
}
```
**Response:**
```json
{
  "message": "Ruta actualizada"
}
```

#### DELETE /tracking/rutas/{ruta_id}
Elimina una ruta.

**Response:**
```json
{
  "message": "Ruta eliminada"
}
```

### Buses

#### GET /tracking/buses
Lista la flota de buses.

**Response:**
```json
[
  {"id": "b1", "numero_disco": "045", "placa": "ABC-1234", "conductor": "Carlos Ruiz"},
  {"id": "b2", "numero_disco": "050", "placa": "XYZ-9876", "conductor": "Luis Gomez"},
  {"id": "b3", "numero_disco": "012", "placa": "DEF-5678", "conductor": "Ana Torres"}
]
```

### GPS y Checkpoints

#### POST /tracking/gps-ping
Registra un ping de GPS de un bus.

**Request:**
```json
{
  "bus_id": "b1",
  "latitude": -2.15,
  "longitude": -79.9,
  "speed": 45.0
}
```
**Response:**
```json
{
  "status": "recorded",
  "timestamp": "2026-02-07T15:30:00Z"
}
```

#### POST /tracking/checkpoint-reach
Registra que un bus llegó a un checkpoint y actualiza el estado de las encomiendas.

**Request:**
```json
{
  "bus_id": "b1",
  "checkpoint_id": "cp-123",
  "encomienda_ids": ["enc-1", "enc-2"]
}
```
**Response:**
```json
{
  "status": "checkpoint_updated",
  "affected_items": 2
}
```

### Tracking de Encomiendas

#### GET /tracking/{tracking_code}
Obtiene el último estado de una encomienda por su código de tracking.

**Response:**
```json
{
  "tracking_code": "enc-1",
  "status": "en_transito",
  "location": "Checkpoint cp-123",
  "timestamp": "2026-02-07T15:30:00Z",
  "message": "Paquete arribó a punto de control"
}
```

---

## Notas
- Todos los endpoints pueden requerir autenticación JWT (ver /auth/jwt/login).
- Los endpoints del gateway simplemente redirigen la petición al microservicio correspondiente.
- Los bodys y respuestas pueden variar según la lógica interna de cada microservicio.

Para más detalles, consulta los endpoints `/docs` de cada microservicio.
