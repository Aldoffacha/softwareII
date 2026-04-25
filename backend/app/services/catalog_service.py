from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.db_models import Aerolinea, Aeropuerto
from app.schemas.catalogs import (
    AirlineCreate,
    AirlineUpdate,
    AirportCreate,
    AirportUpdate,
)


class CatalogService:
    @staticmethod
    def list_airports(db: Session) -> list[Aeropuerto]:
        return db.query(Aeropuerto).order_by(Aeropuerto.ciudad.asc()).all()

    @staticmethod
    def create_airport(db: Session, data: AirportCreate) -> Aeropuerto:
        airport = Aeropuerto(**data.model_dump())
        db.add(airport)
        db.commit()
        db.refresh(airport)
        return airport

    @staticmethod
    def update_airport(db: Session, airport_id: int, data: AirportUpdate) -> Aeropuerto:
        airport = db.get(Aeropuerto, airport_id)
        if airport is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Aeropuerto no encontrado")

        for key, value in data.model_dump(exclude_none=True).items():
            setattr(airport, key, value)

        db.add(airport)
        db.commit()
        db.refresh(airport)
        return airport

    @staticmethod
    def delete_airport(db: Session, airport_id: int) -> None:
        airport = db.get(Aeropuerto, airport_id)
        if airport is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Aeropuerto no encontrado")
        db.delete(airport)
        db.commit()

    @staticmethod
    def list_airlines(db: Session) -> list[Aerolinea]:
        return db.query(Aerolinea).order_by(Aerolinea.nombre.asc()).all()

    @staticmethod
    def create_airline(db: Session, data: AirlineCreate) -> Aerolinea:
        airline = Aerolinea(**data.model_dump())
        db.add(airline)
        db.commit()
        db.refresh(airline)
        return airline

    @staticmethod
    def update_airline(db: Session, airline_id: int, data: AirlineUpdate) -> Aerolinea:
        airline = db.get(Aerolinea, airline_id)
        if airline is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Aerolinea no encontrada")

        for key, value in data.model_dump(exclude_none=True).items():
            setattr(airline, key, value)

        db.add(airline)
        db.commit()
        db.refresh(airline)
        return airline

    @staticmethod
    def delete_airline(db: Session, airline_id: int) -> None:
        airline = db.get(Aerolinea, airline_id)
        if airline is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Aerolinea no encontrada")
        db.delete(airline)
        db.commit()
