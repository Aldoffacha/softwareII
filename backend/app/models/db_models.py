import enum
import uuid

from sqlalchemy import (
    Boolean,
    CHAR,
    Date,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    String,
    Text,
    Time,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class EstadoVuelo(str, enum.Enum):
    PROGRAMADO = "PROGRAMADO"
    ABORDANDO = "ABORDANDO"
    DESPEGO = "DESPEGO"
    ATERRIZO = "ATERRIZO"
    CANCELADO = "CANCELADO"
    RETRASADO = "RETRASADO"
    DESVIADO = "DESVIADO"


class TipoNotificacion(str, enum.Enum):
    EMAIL = "EMAIL"
    CONSULTA = "CONSULTA"
    SISTEMA = "SISTEMA"


class Rol(Base):
    __tablename__ = "roles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    nombre: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    descripcion: Mapped[str | None] = mapped_column(Text)
    permisos: Mapped[dict] = mapped_column(JSONB, default={})
    activo: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    creado_en: Mapped[DateTime] = mapped_column(DateTime(timezone=True), nullable=False, server_default=func.now())


class Usuario(Base):
    __tablename__ = "usuarios"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nombre: Mapped[str] = mapped_column(String(100), nullable=False)
    apellido: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    rol_id: Mapped[int] = mapped_column(ForeignKey("roles.id"), nullable=False)
    activo: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    ultimo_login: Mapped[DateTime | None] = mapped_column(DateTime(timezone=True))
    creado_en: Mapped[DateTime] = mapped_column(DateTime(timezone=True), nullable=False, server_default=func.now())
    actualizado_en: Mapped[DateTime] = mapped_column(DateTime(timezone=True), nullable=False, server_default=func.now())


class Aeropuerto(Base):
    __tablename__ = "aeropuertos"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    codigo_iata: Mapped[str] = mapped_column(CHAR(3), nullable=False, unique=True)
    codigo_icao: Mapped[str | None] = mapped_column(CHAR(4), unique=True)
    nombre: Mapped[str] = mapped_column(String(150), nullable=False)
    ciudad: Mapped[str] = mapped_column(String(100), nullable=False)
    departamento: Mapped[str] = mapped_column(String(100), nullable=False)
    altitud_msnm: Mapped[int | None] = mapped_column(Integer)
    latitud: Mapped[float | None]
    longitud: Mapped[float | None]
    activo: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    creado_en: Mapped[DateTime] = mapped_column(DateTime(timezone=True), nullable=False, server_default=func.now())


class Aerolinea(Base):
    __tablename__ = "aerolineas"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    codigo_iata: Mapped[str] = mapped_column(CHAR(2), nullable=False, unique=True)
    nombre: Mapped[str] = mapped_column(String(150), nullable=False)
    nombre_corto: Mapped[str | None] = mapped_column(String(50))
    pais_origen: Mapped[str] = mapped_column(String(100), nullable=False, default="Bolivia")
    logo_url: Mapped[str | None] = mapped_column(String(500))
    activa: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    creado_en: Mapped[DateTime] = mapped_column(DateTime(timezone=True), nullable=False, server_default=func.now())
    actualizado_en: Mapped[DateTime] = mapped_column(DateTime(timezone=True), nullable=False, server_default=func.now())


class Vuelo(Base):
    __tablename__ = "vuelos"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    codigo_vuelo: Mapped[str] = mapped_column(String(10), nullable=False)
    aerolinea_id: Mapped[int] = mapped_column(ForeignKey("aerolineas.id"), nullable=False)
    aeropuerto_origen_id: Mapped[int] = mapped_column(ForeignKey("aeropuertos.id"), nullable=False)
    aeropuerto_destino_id: Mapped[int] = mapped_column(ForeignKey("aeropuertos.id"), nullable=False)
    fecha_vuelo: Mapped[Date] = mapped_column(Date, nullable=False)
    hora_salida_programada: Mapped[Time] = mapped_column(Time, nullable=False)
    hora_llegada_programada: Mapped[Time] = mapped_column(Time, nullable=False)
    hora_salida_real: Mapped[Time | None] = mapped_column(Time)
    hora_llegada_real: Mapped[Time | None] = mapped_column(Time)
    estado: Mapped[EstadoVuelo] = mapped_column(
        Enum(EstadoVuelo, name="estado_vuelo_enum", create_type=False),
        nullable=False,
        default=EstadoVuelo.PROGRAMADO,
    )
    gate: Mapped[str | None] = mapped_column(String(10))
    terminal: Mapped[str | None] = mapped_column(String(10))
    motivo_retraso: Mapped[str | None] = mapped_column(Text)
    minutos_retraso: Mapped[int] = mapped_column(Integer, default=0)
    registrado_por: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("usuarios.id"))
    creado_en: Mapped[DateTime] = mapped_column(DateTime(timezone=True), nullable=False, server_default=func.now())
    actualizado_en: Mapped[DateTime] = mapped_column(DateTime(timezone=True), nullable=False, server_default=func.now())


class HistorialEstado(Base):
    __tablename__ = "historial_estados"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    vuelo_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("vuelos.id"), nullable=False)
    estado_anterior: Mapped[EstadoVuelo | None] = mapped_column(
        Enum(EstadoVuelo, name="estado_vuelo_enum", create_type=False)
    )
    estado_nuevo: Mapped[EstadoVuelo] = mapped_column(
        Enum(EstadoVuelo, name="estado_vuelo_enum", create_type=False),
        nullable=False,
    )
    comentario: Mapped[str | None] = mapped_column(Text)
    cambiado_por: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("usuarios.id"))
    cambiado_en: Mapped[DateTime] = mapped_column(DateTime(timezone=True), nullable=False, server_default=func.now())


class Notificacion(Base):
    __tablename__ = "notificaciones"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    vuelo_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("vuelos.id"), nullable=False)
    tipo: Mapped[TipoNotificacion] = mapped_column(
        Enum(TipoNotificacion, name="tipo_notificacion_enum", create_type=False),
        nullable=False,
        default=TipoNotificacion.CONSULTA,
    )
    destinatario: Mapped[str | None] = mapped_column(String(255))
    asunto: Mapped[str | None] = mapped_column(String(255))
    cuerpo: Mapped[str] = mapped_column(Text, nullable=False)
    enviada: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    enviada_en: Mapped[DateTime | None] = mapped_column(DateTime(timezone=True))
    creado_en: Mapped[DateTime] = mapped_column(DateTime(timezone=True), nullable=False, server_default=func.now())
