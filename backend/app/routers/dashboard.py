from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_roles
from app.schemas.reports import DashboardResponse
from app.services.dashboard_service import DashboardService


router = APIRouter()


@router.get("", response_model=DashboardResponse)
def summary(
    db: Session = Depends(get_db),
    _=Depends(require_roles("ADMINISTRADOR", "OPERADOR", "PUBLICO")),
):
    return DashboardResponse.model_validate(DashboardService.summary(db))
