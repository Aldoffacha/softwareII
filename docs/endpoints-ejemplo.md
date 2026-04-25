# Ejemplos de Endpoints

## Auth

### Login

POST /api/auth/login

```json
{
  "email": "admin@aasana.gob.bo",
  "password": "Password123!"
}
```

### Register

POST /api/auth/register

```json
{
  "nombre": "Juan",
  "apellido": "Perez",
  "email": "juan@aasana.gob.bo",
  "password": "Password123!",
  "rol_id": 2
}
```

## Vuelos

### Crear vuelo

POST /api/flights

```json
{
  "codigo_vuelo": "OB-999",
  "aerolinea_id": 1,
  "aeropuerto_origen_id": 1,
  "aeropuerto_destino_id": 2,
  "fecha_vuelo": "2026-04-25",
  "hora_salida_programada": "08:00:00",
  "hora_llegada_programada": "09:20:00",
  "estado": "PROGRAMADO",
  "gate": "G7",
  "terminal": "T1"
}
```

### Cambiar estado

PATCH /api/flights/{flight_id}/state

```json
{
  "estado": "RETRASADO",
  "comentario": "Demora por mantenimiento",
  "motivo_retraso": "Revision tecnica"
}
```

## Tablero Publico

GET /api/public/board

## Reportes

- GET /api/reports/punctuality
- GET /api/reports/flights-by-day
- GET /api/reports/delays

## Dashboard

GET /api/dashboard
