"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import { useRequireAuth } from "@/components/RequireAuth";

export default function ReportsPage() {
  useRequireAuth();
  const [punctuality, setPunctuality] = useState<any[]>([]);
  const [byDay, setByDay] = useState<any[]>([]);
  const [delays, setDelays] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      apiGet("/api/reports/punctuality"),
      apiGet("/api/reports/flights-by-day"),
      apiGet("/api/reports/delays"),
    ])
      .then(([p, d, delay]) => {
        setPunctuality(p as any[]);
        setByDay(d as any[]);
        setDelays(delay);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "No fue posible cargar reportes"));
  }, []);

  return (
    <div className="grid">
      <section className="panel">
        <h1>Reportes</h1>
        {error ? <p className="error">{error}</p> : null}
        <h2>Promedio de retrasos</h2>
        <p>
          Promedio: {delays?.promedio_retraso_min ?? 0} min | Maximo: {delays?.maximo_retraso_min ?? 0} min | Vuelos con retraso: {" "}
          {delays?.vuelos_con_retraso ?? 0}
        </p>
      </section>

      <section className="panel">
        <h2>Puntualidad por Aerolinea</h2>
        <table>
          <thead>
            <tr>
              <th>Aerolinea</th>
              <th>Total</th>
              <th>Retrasados</th>
              <th>Cancelados</th>
              <th>% Puntualidad</th>
            </tr>
          </thead>
          <tbody>
            {punctuality.map((item) => (
              <tr key={item.aerolinea_id}>
                <td>{item.aerolinea}</td>
                <td>{item.total_vuelos}</td>
                <td>{item.vuelos_retrasados}</td>
                <td>{item.vuelos_cancelados}</td>
                <td>{item.porcentaje_puntualidad}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="panel">
        <h2>Vuelos por Dia</h2>
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Total</th>
              <th>Programados</th>
              <th>Despegados</th>
              <th>Retrasados</th>
              <th>Cancelados</th>
            </tr>
          </thead>
          <tbody>
            {byDay.map((item) => (
              <tr key={item.fecha_vuelo}>
                <td>{item.fecha_vuelo}</td>
                <td>{item.total}</td>
                <td>{item.programados}</td>
                <td>{item.despegados}</td>
                <td>{item.retrasados}</td>
                <td>{item.cancelados}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
