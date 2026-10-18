# 06 - Especificación de API RESTful y Estándares de Integración

## 1. Convenciones Globales de API REST

Toda la API de **BandHub** sigue los estándares RESTful rigurosos:

- **Base Path**: `/api/v1`
- **Formato de Intercambio**: `application/json` (UTF-8)
- **Nomenclatura JSON**: `camelCase` para propiedades, ISO-8601 (`YYYY-MM-DDTHH:mm:ssZ`) para fechas y timestamps.
- **Identificadores**: Formato `UUID` de 36 caracteres.

---

## 2. Estructura Unificada de Respuestas

### 2.1. Respuesta Exitosa Simple (`ApiResponse<T>`)
```json
{
  "success": true,
  "data": {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "fullName": "Jimi Hendrix",
    "artisticName": "Jimi",
    "roles": ["MUSICIAN", "PRODUCER"]
  },
  "timestamp": "2026-08-01T01:40:00Z"
}
```

### 2.2. Respuesta Paginada (`PagedResponse<T>`)
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 0,
    "size": 20,
    "totalElements": 150,
    "totalPages": 8,
    "isFirst": true,
    "isLast": false
  },
  "timestamp": "2026-08-01T01:40:00Z"
}
```

### 2.3. Estructura Estándar de Error (RFC 7807 Problem Details)
```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "La banda con el ID solicitado no existe.",
    "status": 404,
    "path": "/api/v1/bands/f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "details": [
      {
        "field": "bandId",
        "issue": "UUID inválido o inexistente"
      }
    ]
  },
  "timestamp": "2026-08-01T01:40:00Z"
}
```

---

## 3. Catálogo de Endpoints Representativos por Módulo

### 3.1. Autenticación (`/api/v1/auth`)
- `POST /api/v1/auth/register`: Registro de cuenta.
  - *Request Body*: `{ email, password, fullName }`
  - *Response Code*: `201 Created`
- `POST /api/v1/auth/login`: Autenticación.
  - *Request Body*: `{ email, password }`
  - *Response Body*: `{ accessToken, refreshToken, expiresAt }`
  - *Response Code*: `200 OK`

### 3.2. Usuarios (`/api/v1/users`)
- `GET /api/v1/users/me`: Obtener perfil actual del usuario autenticado.
- `PUT /api/v1/users/me`: Actualizar información básica.
- `POST /api/v1/users/me/roles`: Activar nuevo rol de actor (ej. `TEACHER`, `STUDIO_OWNER`).

### 3.3. Bandas (`/api/v1/bands`)
- `POST /api/v1/bands`: Creación de banda.
- `POST /api/v1/bands/{bandId}/invitations`: Enviar invitación a integrante.
- `POST /api/v1/bands/{bandId}/setlists`: Crear lista de canciones.

### 3.4. Marketplace (`/api/v1/marketplace`)
- `GET /api/v1/marketplace/services`: Búsqueda filtrada de servicios.
  - *Query Params*: `category=PRODUCER&city=BuenosAires&page=0&size=10`
- `POST /api/v1/marketplace/bookings`: Crear solicitud de reserva.

### 3.5. Eventos (`/api/v1/events`)
- `POST /api/v1/events`: Registrar nuevo evento.
- `POST /api/v1/events/{eventId}/tickets/purchase`: Adquirir entradas.
- `POST /api/v1/events/check-in/scan`: Validar código QR en puerta (Check-in).

---

## 4. Códigos de Estado HTTP Utilizados

- `200 OK`: Petición exitosa con cuerpo de respuesta.
- `201 Created`: Recurso creado exitosamente.
- `204 No Content`: Eliminación o actualización exitosa sin cuerpo.
- `400 Bad Request`: Error de validación en los datos enviadas.
- `401 Unauthorized`: Token JWT ausente, expirado o inválido.
- `403 Forbidden`: Permisos o roles insuficientes.
- `404 Not Found`: Recurso no encontrado.
- `409 Conflict`: Conflicto de estado (ej: email duplicado, horario de ensayo solapado).
- `429 Too Many Requests`: Límite de peticiones superado (Rate Limit).
- `500 Internal Server Error`: Error inesperado del servidor.
