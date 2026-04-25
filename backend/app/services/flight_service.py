import uuid

from fastapi import HTTPException, status
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.models.db_models import HistorialEstado, Notificacion, Vuelo
from app.schemas.flights import (
    FlightCreate,
    FlightStateChange,
    FlightUpdate,
    NotificationCreate,
)


class FlightService:
    @staticmethod
    def list_flights(db: Session) -> list[Vuelo]:
        return db.query(Vuelo).order_by(Vuelo.fecha_vuelo.desc()).all()

    @staticmethod
    def get_flight(db: Session, flight_id: uuid.UUID) -> Vuelo:
        flight = db.get(Vuelo, flight_id)
        if flight is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vuelo no encontrado")
        return flight

    @staticmethod
    def create_flight(db: Session, data: FlightCreate, user_id: uuid.UUID) -> Vuelo:
        flight = Vuelo(**data.model_dump(), registrado_por=user_id)
        db.add(flight)
        db.commit()
        db.refresh(flight)
        return flight

    @staticmethod
    def update_flight(db: Session, flight_id: uuid.UUID, data: FlightUpdate) -> Vuelo:
        flight = FlightService.get_flight(db, flight_id)
        for key, value in data.model_dump(exclude_none=True).items():
            setattr(flight, key, value)

        if (
            flight.aeropuerto_origen_id is not None
            and flight.aeropuerto_destino_id is not None
            and flight.aeropuerto_origen_id == flight.aeropuerto_destino_id
        ):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Origen y destino deben ser distintos")

        db.add(flight)
        db.commit()
        db.refresh(flight)
        return flight

    @staticmethod
    def delete_flight(db: Session, flight_id: uuid.UUID) -> None:
        flight = FlightService.get_flight(db, flight_id)
        db.delete(flight)
        db.commit()

    @staticmethod
    def change_state(db: Session, flight_id: uuid.UUID, data: FlightStateChange, user_id: uuid.UUID) -> Vuelo:
        flight = FlightService.get_flight(db, flight_id)
        old_state = flight.estado

        flight.estado = data.estado
        if data.hora_salida_real is not None:
            flight.hora_salida_real = data.hora_salida_real
        if data.hora_llegada_real is not None:
            flight.hora_llegada_real = data.hora_llegada_real
        if data.motivo_retraso is not None:
            flight.motivo_retraso = data.motivo_retraso

        db.add(flight)
        db.flush()

        history = HistorialEstado(
            vuelo_id=flight.id,
            estado_anterior=old_state,
            estado_nuevo=data.estado,
            comentario=data.comentario,
            cambiado_por=user_id,
        )
        db.add(history)
        db.commit()
        db.refresh(flight)
        return flight

    @staticmethod
    def list_notifications_by_flight(db: Session, flight_id: uuid.UUID) -> list[Notificacion]:
        FlightService.get_flight(db, flight_id)
        return (
            db.query(Notificacion)
            .filter(Notificacion.vuelo_id == flight_id)
            .order_by(Notificacion.creado_en.desc())
            .all()
        )

    @staticmethod
    def create_notification(db: Session, flight_id: uuid.UUID, data: NotificationCreate) -> Notificacion:
        FlightService.get_flight(db, flight_id)
        notification = Notificacion(vuelo_id=flight_id, enviada=True, **data.model_dump())
        db.add(notification)
        db.commit()
        db.refresh(notification)
        return notification

    @staticmethod
    def public_board(db: Session) -> list[dict]:
        result = db.execute(text("SELECT * FROM v_tablero_publico ORDER BY fecha_vuelo DESC, hora_salida_programada"))
        return [dict(row._mapping) for row in result]
