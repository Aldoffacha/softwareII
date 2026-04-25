# AASANA - Gestion de Vuelos

Sistema web completo para la gestion de vuelos en aeropuertos de Bolivia.

## Arquitectura

- backend/: API REST con FastAPI y JWT
- frontend/: cliente web con Next.js (App Router)
- database/: schema y seed de PostgreSQL
- docs/: endpoints de ejemplo, errores y soluciones

## Tecnologias

- Backend: Python + FastAPI + SQLAlchemy
- Frontend: Next.js + TypeScript
- Base de datos: PostgreSQL

## Requisitos Previos

- PostgreSQL 14+
- Python 3.11+
- Node.js 20+

## Levantar Base de Datos

1. Crear DB `aasana`
2. Ejecutar:
	- `psql -U postgres -d aasana -f database/schema.sql`

## Levantar Backend

1. Ir a carpeta backend
2. Crear y activar entorno virtual
3. Instalar: `pip install -r requirements.txt`
4. Configurar entorno: copiar `.env.example` a `.env`
5. Ejecutar: `uvicorn app.main:app --reload --port 8000`

## Levantar Frontend

1. Ir a carpeta frontend
2. Instalar: `npm install`
3. Configurar entorno: copiar `.env.example` a `.env.local`
4. Ejecutar: `npm run dev`
5. Abrir: `http://localhost:3000`

## Distribucion de Equipo (3 personas)

- Persona 1: Backend (auth, vuelos, reportes, dashboard)
- Persona 2: Frontend (vistas, consumo API, UX)
- Persona 3: Base de datos y documentacion

## Buenas Practicas Aplicadas

- Arquitectura por capas (routers, services, models, schemas)
- Validacion con Pydantic
- Funciones cortas y nombres claros
- Minimizacion de duplicacion con servicios compartidos
- Documentacion tecnica y de errores
