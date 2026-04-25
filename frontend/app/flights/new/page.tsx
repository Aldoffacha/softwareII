"use client";

import { FormEvent, useEffect, useState } from "react";
import { apiGet, apiSend } from "@/lib/api";
import { useRequireAuth } from "@/components/RequireAuth";
import { Airline, Airport } from "@/types";

export default function NewFlightPage() {
  useRequireAuth();
  const [airlines, setAirlines] = useState<Airline[]>([]);
  const [airports, setAirports] = useState<Airport[]>([]);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    codigo_vuelo: "",
    aerolinea_id: "1",
    aeropuerto_origen_id: "1",
    aeropuerto_destino_id: "2",
    fecha_vuelo: "",
    hora_salida_programada: "06:00",
    hora_llegada_programada: "07:00",
    gate: "G1",
    terminal: "T1",
  });

  useEffect(() => {
    apiGet<Airline[]>("/api/airlines").then(setAirlines).catch(() => setAirlines([]));
    apiGet<Airport[]>("/api/airports").then(setAirports).catch(() => setAirports([]));
  }, []);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    try {
      await apiSend("/api/flights", "POST", {
        ...form,
        aerolinea_id: Number(form.aerolinea_id),
        aeropuerto_origen_id: Number(form.aeropuerto_origen_id),
        aeropuerto_destino_id: Number(form.aeropuerto_destino_id),
      });
      window.location.href = "/flights";
    } catch (err) {
      setError(err instanceof Error ? err.message : "No fue posible registrar vuelo");
    }
  }

  return (
    <section className="panel">
      <h1>Registro de Vuelo</h1>
      <form onSubmit={submit} className="grid grid-2">
        <div>
          <label>Codigo de Vuelo</label>
          <input value={form.codigo_vuelo} onChange={(e) => setForm({ ...form, codigo_vuelo: e.target.value })} />
        </div>
        <div>
          <label>Aerolinea</label>
          <select value={form.aerolinea_id} onChange={(e) => setForm({ ...form, aerolinea_id: e.target.value })}>
            {airlines.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nombre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Origen</label>
          <select
            value={form.aeropuerto_origen_id}
            onChange={(e) => setForm({ ...form, aeropuerto_origen_id: e.target.value })}
          >
            {airports.map((a) => (
              <option key={a.id} value={a.id}>
                {a.codigo_iata} - {a.ciudad}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Destino</label>
          <select
            value={form.aeropuerto_destino_id}
            onChange={(e) => setForm({ ...form, aeropuerto_destino_id: e.target.value })}
          >
            {airports.map((a) => (
              <option key={a.id} value={a.id}>
                {a.codigo_iata} - {a.ciudad}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Fecha</label>
          <input type="date" value={form.fecha_vuelo} onChange={(e) => setForm({ ...form, fecha_vuelo: e.target.value })} />
        </div>
        <div>
          <label>Hora Salida Programada</label>
          <input
            type="time"
            value={form.hora_salida_programada}
            onChange={(e) => setForm({ ...form, hora_salida_programada: e.target.value })}
          />
        </div>
        <div>
          <label>Hora Llegada Programada</label>
          <input
            type="time"
            value={form.hora_llegada_programada}
            onChange={(e) => setForm({ ...form, hora_llegada_programada: e.target.value })}
          />
        </div>
        <div>
          <label>Gate</label>
          <input value={form.gate} onChange={(e) => setForm({ ...form, gate: e.target.value })} />
        </div>
        <div>
          <label>Terminal</label>
          <input value={form.terminal} onChange={(e) => setForm({ ...form, terminal: e.target.value })} />
        </div>
        <div style={{ gridColumn: "1/-1" }}>
          <button type="submit">Guardar Vuelo</button>
        </div>
      </form>
      {error ? <p className="error">{error}</p> : null}
    </section>
  );
}
