from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_roles
from app.schemas.reports import DelaySummary, FlightsByDayItem, PunctualityItem
from app.services.report_service import ReportService


router = APIRouter()


@router.get("/punctuality", response_model=list[PunctualityItem])
def punctuality(
    db: Session = Depends(get_db),
    _=Depends(require_roles("ADMINISTRADOR", "OPERADOR")),
):
    return [PunctualityItem.model_validate(item) for item in ReportService.punctuality(db)]


@router.get("/flights-by-day", response_model=list[FlightsByDayItem])
def flights_by_day(
    db: Session = Depends(get_db),
    _=Depends(require_roles("ADMINISTRADOR", "OPERADOR")),
):
    return [FlightsByDayItem.model_validate(item) for item in ReportService.flights_by_day(db)]


@router.get("/delays", response_model=DelaySummary)
def delays(
    db: Session = Depends(get_db),
    _=Depends(require_roles("ADMINISTRADOR", "OPERADOR")),
):
    return DelaySummary.model_validate(ReportService.delays_summary(db))
