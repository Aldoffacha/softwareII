from sqlalchemy import text
from sqlalchemy.orm import Session


class ReportService:
    @staticmethod
    def punctuality(db: Session) -> list[dict]:
        result = db.execute(text("SELECT * FROM v_puntualidad_aerolinea ORDER BY porcentaje_puntualidad DESC NULLS LAST"))
        return [dict(row._mapping) for row in result]

    @staticmethod
    def flights_by_day(db: Session) -> list[dict]:
        result = db.execute(text("SELECT * FROM v_vuelos_por_dia ORDER BY fecha_vuelo DESC"))
        return [dict(row._mapping) for row in result]

    @staticmethod
    def delays_summary(db: Session) -> dict:
        result = db.execute(
            text(
                """
                SELECT
                    COALESCE(ROUND(AVG(minutos_retraso)::numeric, 2), 0) AS promedio_retraso_min,
                    COALESCE(MAX(minutos_retraso), 0) AS maximo_retraso_min,
                    COUNT(*) FILTER (WHERE minutos_retraso > 0) AS vuelos_con_retraso
                FROM vuelos
                """
            )
        ).first()
        row = dict(result._mapping) if result else {}
        return {
            "promedio_retraso_min": float(row.get("promedio_retraso_min", 0) or 0),
            "maximo_retraso_min": int(row.get("maximo_retraso_min", 0) or 0),
            "vuelos_con_retraso": int(row.get("vuelos_con_retraso", 0) or 0),
        }
