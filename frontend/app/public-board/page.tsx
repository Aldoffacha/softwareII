"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";

export default function PublicBoardPage() {
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState("");

  async function loadBoard() {
    try {
      const rows = await apiGet<any[]>("/api/public/board", true);
      setItems(rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No fue posible cargar tablero");
    }
  }

  useEffect(() => {
    loadBoard();
    const timer = setInterval(loadBoard, 15000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="panel">
      <h1>Tablero Publico de Vuelos</h1>
      <p>Llegadas y salidas con refresco cada 15 segundos.</p>
      {error ? <p className="error">{error}</p> : null}
      <table>
        <thead>
          <tr>
            <th>Vuelo</th>
            <th>Aerolinea</th>
            <th>Ruta</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Terminal/Gate</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.codigo_vuelo}</td>
              <td>{item.aerolinea}</td>
              <td>
                {item.origen_iata} - {item.destino_iata}
              </td>
              <td>{item.fecha_vuelo}</td>
              <td>{item.estado}</td>
              <td>
                {item.terminal || "-"} / {item.gate || "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
