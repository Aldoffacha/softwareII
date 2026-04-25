from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_roles
from app.schemas.catalogs import AirlineCreate, AirlineResponse, AirlineUpdate
from app.services.catalog_service import CatalogService


router = APIRouter()


@router.get("", response_model=list[AirlineResponse])
def list_airlines(db: Session = Depends(get_db), _=Depends(require_roles("ADMINISTRADOR", "OPERADOR"))):
    return [AirlineResponse.model_validate(item) for item in CatalogService.list_airlines(db)]


@router.post("", response_model=AirlineResponse, status_code=status.HTTP_201_CREATED)
def create_airline(
    data: AirlineCreate,
    db: Session = Depends(get_db),
    _=Depends(require_roles("ADMINISTRADOR")),
):
    return AirlineResponse.model_validate(CatalogService.create_airline(db, data))


@router.put("/{airline_id}", response_model=AirlineResponse)
def update_airline(
    airline_id: int,
    data: AirlineUpdate,
    db: Session = Depends(get_db),
    _=Depends(require_roles("ADMINISTRADOR")),
):
    return AirlineResponse.model_validate(CatalogService.update_airline(db, airline_id, data))


@router.delete("/{airline_id}", status_code=status.HTTP_204_NO_CONTENT, response_class=Response)
def delete_airline(
    airline_id: int,
    db: Session = Depends(get_db),
    _=Depends(require_roles("ADMINISTRADOR")),
):
    CatalogService.delete_airline(db, airline_id)
