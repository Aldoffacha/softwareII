import uuid
from datetime import date, datetime, time

from pydantic import BaseModel, Field, model_validator

from app.models.db_models import EstadoVuelo, TipoNotificacion


class FlightBase(BaseModel):
    codigo_vuelo: str = Field(min_length=3, max_length=10)
    aerolinea_id: int
    aeropuerto_origen_id: int
    aeropuerto_destino_id: int
    fecha_vuelo: date
    hora_salida_programada: time
    hora_llegada_programada: time
    gate: str | None = Field(default=None, max_length=10)
    terminal: str | None = Field(default=None, max_length=10)

    @model_validator(mode="after")
    def validate_airports(self) -> "FlightBase":
        if self.aeropuerto_origen_id == self.aeropuerto_destino_id:
            raise ValueError("El aeropuerto de origen no puede ser igual al destino")
        return self


class FlightCreate(FlightBase):
    estado: EstadoVuelo = EstadoVuelo.PROGRAMADO


class FlightUpdate(BaseModel):
    codigo_vuelo: str | None = Field(default=None, min_length=3, max_length=10)
    aerolinea_id: int | None = None
    aeropuerto_origen_id: int | None = None
    aeropuerto_destino_id: int | None = None
    fecha_vuelo: date | None = None
    hora_salida_programada: time | None = None
    hora_llegada_programada: time | None = None
    hora_salida_real: time | None = None
    hora_llegada_real: time | None = None
    gate: str | None = Field(default=None, max_length=10)
    terminal: str | None = Field(default=None, max_length=10)
    motivo_retraso: str | None = None


class FlightStateChange(BaseModel):
    estado: EstadoVuelo
    comentario: str | None = None
    hora_salida_real: time | None = None
    hora_llegada_real: time | None = None
    motivo_retraso: str | None = None


class FlightResponse(BaseModel):
    id: uuid.UUID
    codigo_vuelo: str
    aerolinea_id: int
    aeropuerto_origen_id: int
    aeropuerto_destino_id: int
    fecha_vuelo: date
    hora_salida_programada: time
    hora_llegada_programada: time
    hora_salida_real: time | None
    hora_llegada_real: time | None
    estado: EstadoVuelo
    gate: str | None
    terminal: str | None
    motivo_retraso: str | None
    minutos_retraso: int
    registrado_por: uuid.UUID | None
    creado_en: datetime
    actualizado_en: datetime

    class Config:
        from_attributes = True


class NotificationCreate(BaseModel):
    tipo: TipoNotificacion = TipoNotificacion.CONSULTA
    destinatario: str | None = Field(default=None, max_length=255)
    asunto: str | None = Field(default=None, max_length=255)
    cuerpo: str = Field(min_length=3)


class NotificationResponse(BaseModel):
    id: uuid.UUID
    vuelo_id: uuid.UUID
    tipo: TipoNotificacion
    destinatario: str | None
    asunto: str | None
    cuerpo: str
    enviada: bool
    enviado_en: datetime | None
    creado_en: datetime

    class Config:
        from_attributes = True
