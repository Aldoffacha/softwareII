# Backend - AASANA Gestion de Vuelos

## Stack

- FastAPI
- SQLAlchemy
- PostgreSQL
- JWT (python-jose)

## Estructura

app/
- core/: configuracion, seguridad, base de datos, dependencias
- models/: modelos ORM mapeados al schema existente
- schemas/: validaciones y contratos con Pydantic
- services/: logica de negocio
- routers/: endpoints REST

## Configuracion

1. Copiar `.env.example` a `.env`
2. Ajustar `DATABASE_URL` a tu instancia PostgreSQL
3. Ejecutar schema:
	- `psql -U postgres -d aasana -f ../database/schema.sql`

## Ejecucion

1. Instalar dependencias:
	- `pip install -r requirements.txt`
2. Levantar API:
	- `uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`
3. Swagger:
	- `http://localhost:8000/docs`

## Endpoints Base

- Auth: `/api/auth/login`, `/api/auth/register`, `/api/auth/me`
- Vuelos: `/api/flights`
- Aerolineas: `/api/airlines`
- Aeropuertos: `/api/airports`
- Tablero publico: `/api/public/board`
- Notificaciones: `/api/notifications/flight/{flight_id}`
- Reportes: `/api/reports/punctuality`, `/api/reports/flights-by-day`, `/api/reports/delays`
- Dashboard: `/api/dashboard`
