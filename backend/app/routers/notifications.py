import uuid

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_roles
from app.schemas.flights import NotificationCreate, NotificationResponse
from app.services.flight_service import FlightService


router = APIRouter()


@router.get("/flight/{flight_id}", response_model=list[NotificationResponse])
def list_notifications_by_flight(
    flight_id: uuid.UUID,
    db: Session = Depends(get_db),
    _=Depends(require_roles("ADMINISTRADOR", "OPERADOR")),
):
    return [
        NotificationResponse.model_validate(item)
        for item in FlightService.list_notifications_by_flight(db, flight_id)
    ]


@router.post("/flight/{flight_id}", response_model=NotificationResponse, status_code=status.HTTP_201_CREATED)
def create_notification(
    flight_id: uuid.UUID,
    data: NotificationCreate,
    db: Session = Depends(get_db),
    _=Depends(require_roles("ADMINISTRADOR", "OPERADOR")),
):
    return NotificationResponse.model_validate(FlightService.create_notification(db, flight_id, data))
