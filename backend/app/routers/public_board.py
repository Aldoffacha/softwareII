from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.flight_service import FlightService


router = APIRouter()


@router.get("/board")
def public_board(db: Session = Depends(get_db)) -> list[dict]:
    return FlightService.public_board(db)
