import uuid

from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import AuthenticatedUser, get_current_user, require_roles
from app.schemas.flights import FlightCreate, FlightResponse, FlightStateChange, FlightUpdate
from app.services.flight_service import FlightService


router = APIRouter()


@router.get("", response_model=list[FlightResponse])
def list_flights(
    db: Session = Depends(get_db),
    _=Depends(require_roles("ADMINISTRADOR", "OPERADOR")),
):
    return [FlightResponse.model_validate(item) for item in FlightService.list_flights(db)]


@router.get("/{flight_id}", response_model=FlightResponse)
def get_flight(
    flight_id: uuid.UUID,
    db: Session = Depends(get_db),
    _=Depends(require_roles("ADMINISTRADOR", "OPERADOR")),
):
    return FlightResponse.model_validate(FlightService.get_flight(db, flight_id))


@router.post("", response_model=FlightResponse, status_code=status.HTTP_201_CREATED)
def create_flight(
    data: FlightCreate,
    db: Session = Depends(get_db),
    current: AuthenticatedUser = Depends(require_roles("ADMINISTRADOR", "OPERADOR")),
):
    return FlightResponse.model_validate(FlightService.create_flight(db, data, current.user.id))


@router.put("/{flight_id}", response_model=FlightResponse)
def update_flight(
    flight_id: uuid.UUID,
    data: FlightUpdate,
    db: Session = Depends(get_db),
    _=Depends(require_roles("ADMINISTRADOR", "OPERADOR")),
):
    return FlightResponse.model_validate(FlightService.update_flight(db, flight_id, data))


@router.delete("/{flight_id}", status_code=status.HTTP_204_NO_CONTENT, response_class=Response)
def delete_flight(
    flight_id: uuid.UUID,
    db: Session = Depends(get_db),
    _=Depends(require_roles("ADMINISTRADOR")),
):
    FlightService.delete_flight(db, flight_id)


@router.patch("/{flight_id}/state", response_model=FlightResponse)
def change_state(
    flight_id: uuid.UUID,
    data: FlightStateChange,
    db: Session = Depends(get_db),
    current: AuthenticatedUser = Depends(require_roles("ADMINISTRADOR", "OPERADOR")),
):
    return FlightResponse.model_validate(FlightService.change_state(db, flight_id, data, current.user.id))
