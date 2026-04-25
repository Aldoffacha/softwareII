from datetime import date

from pydantic import BaseModel


class PublicBoardItem(BaseModel):
    id: str
    codigo_vuelo: str
    aerolinea: str
    codigo_aerolinea: str
    origen_iata: str
    origen_ciudad: str
    destino_iata: str
    destino_ciudad: str
    fecha_vuelo: date
    hora_salida_programada: str
    hora_llegada_programada: str
    hora_salida_real: str | None
    hora_llegada_real: str | None
    estado: str
    gate: str | None
    terminal: str | None
    minutos_retraso: int | None


class PunctualityItem(BaseModel):
    aerolinea_id: int
    aerolinea: str
    codigo_iata: str
    total_vuelos: int
    vuelos_puntuales: int
    vuelos_retrasados: int
    vuelos_cancelados: int
    retraso_promedio_min: float | None
    porcentaje_puntualidad: float | None


class FlightsByDayItem(BaseModel):
    fecha_vuelo: date
    total: int
    programados: int
    despegados: int
    aterrizados: int
    retrasados: int
    cancelados: int
    retraso_promedio_min: float | None


class DelaySummary(BaseModel):
    promedio_retraso_min: float
    maximo_retraso_min: int
    vuelos_con_retraso: int


class DashboardResponse(BaseModel):
    total_vuelos_hoy: int
    retrasados_hoy: int
    cancelados_hoy: int
    puntualidad_hoy: float
    top_aerolineas_puntuales: list[PunctualityItem]
