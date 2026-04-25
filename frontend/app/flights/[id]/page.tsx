"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import { useRequireAuth } from "@/components/RequireAuth";

export default function FlightDetailPage({ params }: { params: { id: string } }) {
  useRequireAuth();
  const [flight, setFlight] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    apiGet(`/api/flights/${params.id}`)
      .then(setFlight)
      .catch((err) => setError(err instanceof Error ? err.message : "No fue posible cargar vuelo"));

    apiGet<any[]>(`/api/notifications/flight/${params.id}`)
      .then(setNotifications)
      .catch(() => setNotifications([]));
  }, [params.id]);

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!flight) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="grid">
      <section className="panel">
        <h1>Detalle de Vuelo {flight.codigo_vuelo}</h1>
        <p>Estado actual: {flight.estado}</p>
        <p>Fecha: {flight.fecha_vuelo}</p>
        <p>Horario: {flight.hora_salida_programada} - {flight.hora_llegada_programada}</p>
        <p>Retraso: {flight.minutos_retraso} min</p>
      </section>

      <section className="panel">
        <h2>Notificaciones</h2>
        {notifications.length === 0 ? <p>Sin notificaciones registradas.</p> : null}
        {notifications.map((n) => (
          <article key={n.id} style={{ borderBottom: "1px solid #dfd5b8", paddingBottom: 8, marginBottom: 8 }}>
            <strong>{n.tipo}</strong>
            <p>{n.asunto || "Sin asunto"}</p>
            <p>{n.cuerpo}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
