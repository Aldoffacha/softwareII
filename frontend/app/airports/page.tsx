"use client";

import { FormEvent, useEffect, useState } from "react";
import { apiGet, apiSend } from "@/lib/api";
import { Airport } from "@/types";

export default function AirportsPage() {
  const [airports, setAirports] = useState<Airport[]>([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    codigo_iata: "",
    codigo_icao: "",
    nombre: "",
    ciudad: "",
    departamento: "",
  });

  async function loadAirports() {
    try {
      setAirports(await apiGet<Airport[]>("/api/airports"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "No fue posible cargar aeropuertos");
    }
  }

  useEffect(() => {
    loadAirports();
  }, []);

  async function createAirport(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await apiSend("/api/airports", "POST", form);
      setForm({ codigo_iata: "", codigo_icao: "", nombre: "", ciudad: "", departamento: "" });
      loadAirports();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error creando aeropuerto");
    }
  }

  async function remove(id: number) {
    try {
      await apiSend(`/api/airports/${id}`, "DELETE");
      loadAirports();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error eliminando aeropuerto");
    }
  }

  return (
    <div className="grid grid-2">
      <section className="panel">
        <h1>CRUD Aeropuertos</h1>
        <form onSubmit={createAirport} className="grid">
          <div>
            <label>Codigo IATA</label>
            <input value={form.codigo_iata} onChange={(e) => setForm({ ...form, codigo_iata: e.target.value })} />
          </div>
          <div>
            <label>Codigo ICAO</label>
            <input value={form.codigo_icao} onChange={(e) => setForm({ ...form, codigo_icao: e.target.value })} />
          </div>
          <div>
            <label>Nombre</label>
            <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
          </div>
          <div>
            <label>Ciudad</label>
            <input value={form.ciudad} onChange={(e) => setForm({ ...form, ciudad: e.target.value })} />
          </div>
          <div>
            <label>Departamento</label>
            <input value={form.departamento} onChange={(e) => setForm({ ...form, departamento: e.target.value })} />
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
              <th>Ciudad</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {airports.map((item) => (
              <tr key={item.id}>
                <td>{item.codigo_iata}</td>
                <td>{item.nombre}</td>
                <td>{item.ciudad}</td>
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
