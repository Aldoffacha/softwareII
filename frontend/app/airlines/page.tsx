"use client";

import { FormEvent, useEffect, useState } from "react";
import { apiGet, apiSend } from "@/lib/api";
import { Airline } from "@/types";

export default function AirlinesPage() {
  const [airlines, setAirlines] = useState<Airline[]>([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ codigo_iata: "", nombre: "", nombre_corto: "", pais_origen: "Bolivia" });

  async function loadAirlines() {
    try {
      setAirlines(await apiGet<Airline[]>("/api/airlines"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "No fue posible cargar aerolineas");
    }
  }

  useEffect(() => {
    loadAirlines();
  }, []);

  async function createAirline(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await apiSend("/api/airlines", "POST", form);
      setForm({ codigo_iata: "", nombre: "", nombre_corto: "", pais_origen: "Bolivia" });
      loadAirlines();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error creando aerolinea");
    }
  }

  async function remove(id: number) {
    try {
      await apiSend(`/api/airlines/${id}`, "DELETE");
      loadAirlines();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error eliminando aerolinea");
    }
  }

  return (
    <div className="grid grid-2">
      <section className="panel">
        <h1>CRUD Aerolineas</h1>
        <form onSubmit={createAirline} className="grid">
          <div>
            <label>Codigo IATA</label>
            <input value={form.codigo_iata} onChange={(e) => setForm({ ...form, codigo_iata: e.target.value })} />
          </div>
          <div>
            <label>Nombre</label>
            <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
          </div>
          <div>
            <label>Nombre Corto</label>
            <input value={form.nombre_corto} onChange={(e) => setForm({ ...form, nombre_corto: e.target.value })} />
          </div>
          <div>
            <label>Pais de Origen</label>
            <input value={form.pais_origen} onChange={(e) => setForm({ ...form, pais_origen: e.target.value })} />
          </div>
          <button type="submit">Crear</button>
        </form>
        {error ? <p className="error">{error}</p> : null}
      </section>

      <section className="panel">
        <h2>Listado</h2>
        <table>
          <thead>
            <tr>
              <th>IATA</th>
              <th>Nombre</th>
              <th>Pais</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {airlines.map((item) => (
              <tr key={item.id}>
                <td>{item.codigo_iata}</td>
                <td>{item.nombre}</td>
                <td>{item.pais_origen}</td>
                <td>
                  <button className="secondary" onClick={() => remove(item.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
