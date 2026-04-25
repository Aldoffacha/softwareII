"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";

interface DashboardData {
  total_vuelos_hoy: number;
  retrasados_hoy: number;
  cancelados_hoy: number;
  puntualidad_hoy: number;
  top_aerolineas_puntuales: {
    aerolinea_id: number;
    aerolinea: string;
    total_vuelos: number;
    vuelos_puntuales: number;
    porcentaje_puntualidad: number;
  }[];
}

export default function DashboardPage() {
  const [data,  setData]  = useState<DashboardData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiGet<DashboardData>("/api/dashboard")
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : "No fue posible cargar dashboard"));
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!data)  return <p className="text-muted">Cargando dashboard…</p>;

  const puntualidadClass =
    data.puntualidad_hoy >= 80 ? "badge-ok"
    : data.puntualidad_hoy >= 60 ? "badge-warn"
    : "badge-danger";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* KPIs */}
      <div className="grid-2">
        <section className="panel kpi">
          <h2>Vuelos Hoy</h2>
          <p>{data.total_vuelos_hoy}</p>
        </section>
        <section className="panel kpi">
          <h2>Retrasados</h2>
          <p style={{ color: data.retrasados_hoy > 0 ? "#fcd34d" : undefined }}>
            {data.retrasados_hoy}
          </p>
        </section>
        <section className="panel kpi">
          <h2>Cancelados</h2>
          <p style={{ color: data.cancelados_hoy > 0 ? "#fca5a5" : undefined }}>
            {data.cancelados_hoy}
          </p>
        </section>
        <section className="panel kpi">
          <h2>Puntualidad</h2>
          <p>{data.puntualidad_hoy}%</p>
        </section>
      </div>

      {/* Tabla aerolíneas */}
      <section className="panel">
        <h2>Top Aerolíneas Puntuales</h2>
        <table>
          <thead>
            <tr>
              <th>Aerolínea</th>
              <th>Total</th>
              <th>Puntuales</th>
              <th>% Puntualidad</th>
            </tr>
          </thead>
          <tbody>
            {(data.top_aerolineas_puntuales || []).map((item) => (
              <tr key={item.aerolinea_id}>
                <td>{item.aerolinea}</td>
                <td>{item.total_vuelos}</td>
                <td>{item.vuelos_puntuales}</td>
                <td>
                  <span className={`badge ${
                    item.porcentaje_puntualidad >= 80 ? "badge-ok"
                    : item.porcentaje_puntualidad >= 60 ? "badge-warn"
                    : "badge-danger"
                  }`}>
                    {item.porcentaje_puntualidad}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}