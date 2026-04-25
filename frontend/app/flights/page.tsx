"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiGet, apiSend } from "@/lib/api";
import { useRequireAuth } from "@/components/RequireAuth";
import { Flight } from "@/types";

const STATES = ["PROGRAMADO", "ABORDANDO", "DESPEGO", "RETRASADO", "CANCELADO", "ATERRIZO"];

const STATE_BADGE: Record<string, string> = {
  PROGRAMADO: "badge-neutral",
  ABORDANDO:  "badge-ok",
  DESPEGO:    "badge-ok",
  RETRASADO:  "badge-warn",
  CANCELADO:  "badge-danger",
  ATERRIZO:   "badge-neutral",
};

export default function FlightsPage() {
  useRequireAuth();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [error,   setError]   = useState("");

  async function loadFlights() {
    try {
      setFlights(await apiGet<Flight[]>("/api/flights"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error cargando vuelos");
    }
  }

  async function changeState(id: string, estado: string) {
    try {
      await apiSend(`/api/flights/${id}/state`, "PATCH", { estado });
      await loadFlights();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No fue posible actualizar el estado");
    }
  }

  useEffect(() => { loadFlights(); }, []);

  return (
    <section className="panel">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <h1 style={{ margin: 0 }}>Gestión de Vuelos</h1>
        <Link href="/flights/new" className="btn" style={{ fontSize: ".82rem", padding: ".4rem 1rem" }}>
          + Nuevo vuelo
        </Link>
      </div>

      {error && <p className="error">{error}</p>}

      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Retraso</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {flights.map((f) => (
            <tr key={f.id}>
              <td className="mono" style={{ fontSize: ".82rem", color: "#93c5fd" }}>{f.codigo_vuelo}</td>
              <td>{f.fecha_vuelo}</td>
              <td>
                <select
                  value={f.estado}
                  onChange={(e) => changeState(f.id, e.target.value)}
                  style={{ width: "auto", fontSize: ".78rem", padding: "3px 28px 3px 8px" }}
                >
                  {STATES.map((st) => <option key={st}>{st}</option>)}
                </select>
              </td>
              <td style={{ color: f.minutos_retraso > 0 ? "#fcd34d" : undefined }}>
                {f.minutos_retraso > 0 ? `${f.minutos_retraso} min` : "—"}
              </td>
              <td>
                <Link href={`/flights/${f.id}`}>Ver</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}