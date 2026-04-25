from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routers import auth, airports, airlines, flights, notifications, public_board, reports, dashboard


app = FastAPI(title=settings.app_name, debug=settings.app_debug)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in settings.cors_origins.split(",") if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["health"])
def healthcheck() -> dict[str, str]:
    return {"status": "ok"}


app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(airports.router, prefix="/api/airports", tags=["airports"])
app.include_router(airlines.router, prefix="/api/airlines", tags=["airlines"])
app.include_router(flights.router, prefix="/api/flights", tags=["flights"])
app.include_router(notifications.router, prefix="/api/notifications", tags=["notifications"])
app.include_router(public_board.router, prefix="/api/public", tags=["public"])
app.include_router(reports.router, prefix="/api/reports", tags=["reports"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])
