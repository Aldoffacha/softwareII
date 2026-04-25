from sqlalchemy import text
from sqlalchemy.orm import Session

from app.services.report_service import ReportService


class DashboardService:
    @staticmethod
    def summary(db: Session) -> dict:
        kpi = db.execute(
            text(
                """
                SELECT
                    COUNT(*) AS total_vuelos_hoy,
                    COUNT(*) FILTER (WHERE estado = 'RETRASADO') AS retrasados_hoy,
                    COUNT(*) FILTER (WHERE estado = 'CANCELADO') AS cancelados_hoy,
                    COALESCE(
                        ROUND(
                            COUNT(*) FILTER (
                                WHERE estado = 'DESPEGO' AND (minutos_retraso = 0 OR minutos_retraso IS NULL)
                            ) * 100.0 / NULLIF(COUNT(*), 0),
                            1
                        ),
                        0
                    ) AS puntualidad_hoy
                FROM vuelos
                WHERE fecha_vuelo = CURRENT_DATE
                """
            )
        ).first()

        row = dict(kpi._mapping) if kpi else {}
        top_airlines = ReportService.punctuality(db)[:5]

        return {
            "total_vuelos_hoy": int(row.get("total_vuelos_hoy", 0) or 0),
            "retrasados_hoy": int(row.get("retrasados_hoy", 0) or 0),
            "cancelados_hoy": int(row.get("cancelados_hoy", 0) or 0),
            "puntualidad_hoy": float(row.get("puntualidad_hoy", 0) or 0),
            "top_aerolineas_puntuales": top_airlines,
        }
