from datetime import datetime

from pydantic import BaseModel, Field


class AirportBase(BaseModel):
    codigo_iata: str = Field(min_length=3, max_length=3)
    codigo_icao: str | None = Field(default=None, min_length=4, max_length=4)
    nombre: str = Field(min_length=3, max_length=150)
    ciudad: str = Field(min_length=2, max_length=100)
    departamento: str = Field(min_length=2, max_length=100)
    altitud_msnm: int | None = None
    latitud: float | None = None
    longitud: float | None = None
    activo: bool = True


class AirportCreate(AirportBase):
    pass


class AirportUpdate(BaseModel):
    codigo_iata: str | None = Field(default=None, min_length=3, max_length=3)
    codigo_icao: str | None = Field(default=None, min_length=4, max_length=4)
    nombre: str | None = Field(default=None, min_length=3, max_length=150)
    ciudad: str | None = Field(default=None, min_length=2, max_length=100)
    departamento: str | None = Field(default=None, min_length=2, max_length=100)
    altitud_msnm: int | None = None
    latitud: float | None = None
    longitud: float | None = None
    activo: bool | None = None


class AirportResponse(AirportBase):
    id: int
    creado_en: datetime

    class Config:
        from_attributes = True


class AirlineBase(BaseModel):
    codigo_iata: str = Field(min_length=2, max_length=2)
    nombre: str = Field(min_length=2, max_length=150)
    nombre_corto: str | None = Field(default=None, max_length=50)
    pais_origen: str = Field(default="Bolivia", min_length=2, max_length=100)
    logo_url: str | None = Field(default=None, max_length=500)
    activa: bool = True


class AirlineCreate(AirlineBase):
    pass


class AirlineUpdate(BaseModel):
    codigo_iata: str | None = Field(default=None, min_length=2, max_length=2)
    nombre: str | None = Field(default=None, min_length=2, max_length=150)
    nombre_corto: str | None = Field(default=None, max_length=50)
    pais_origen: str | None = Field(default=None, min_length=2, max_length=100)
    logo_url: str | None = Field(default=None, max_length=500)
    activa: bool | None = None


class AirlineResponse(AirlineBase):
    id: int
    creado_en: datetime
    actualizado_en: datetime

    class Config:
        from_attributes = True
