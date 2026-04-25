from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_roles
from app.schemas.catalogs import AirportCreate, AirportResponse, AirportUpdate
from app.services.catalog_service import CatalogService


router = APIRouter()


@router.get("", response_model=list[AirportResponse])
def list_airports(db: Session = Depends(get_db), _=Depends(require_roles("ADMINISTRADOR", "OPERADOR"))):
    return [AirportResponse.model_validate(item) for item in CatalogService.list_airports(db)]


@router.post("", response_model=AirportResponse, status_code=status.HTTP_201_CREATED)
def create_airport(
    data: AirportCreate,
    db: Session = Depends(get_db),
    _=Depends(require_roles("ADMINISTRADOR")),
):
    return AirportResponse.model_validate(CatalogService.create_airport(db, data))


@router.put("/{airport_id}", response_model=AirportResponse)
def update_airport(
    airport_id: int,
    data: AirportUpdate,
    db: Session = Depends(get_db),
    _=Depends(require_roles("ADMINISTRADOR")),
):
    return AirportResponse.model_validate(CatalogService.update_airport(db, airport_id, data))


@router.delete("/{airport_id}", status_code=status.HTTP_204_NO_CONTENT, response_class=Response)
def delete_airport(
    airport_id: int,
    db: Session = Depends(get_db),
    _=Depends(require_roles("ADMINISTRADOR")),
):
    CatalogService.delete_airport(db, airport_id)
