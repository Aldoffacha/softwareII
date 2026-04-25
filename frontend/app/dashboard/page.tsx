"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import { useRequireAuth } from "@/components/RequireAuth";
import { UserProfile } from "@/types";

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

    apiGet<DashboardData>("/api/dashboard")
      .then(setData)
=======
    Promise.all([apiGet<UserProfile>("/api/auth/me"), apiGet("/api/dashboard")])
      .then(([profile, dashboard]) => {
        setUser(profile);
        setData(dashboard);
      })
>>>>>>> 9578619 (Avance: mejoras en backend y frontend)
      .catch((err) => setError(err instanceof Error ? err.message : "No fue posible cargar dashboard"));
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!data)  return <p className="text-muted">Cargando dashboard…</p>;

  const puntualidadClass =
    data.puntualidad_hoy >= 80 ? "badge-ok"
    : data.puntualidad_hoy >= 60 ? "badge-warn"
    : "badge-danger";

<<<<<<< HEAD
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
=======
  const role = user?.rol_nombre ?? "PUBLICO";
  const isAdmin = role === "ADMINISTRADOR";
  const isOperator = role === "OPERADOR";
  const isPublic = role === "PUBLICO";

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className="panel sidebar-card">
          <p className="label">Usuario</p>
          <h2>{user?.nombre} {user?.apellido}</h2>
          <span className={`role-badge role-${role.toLowerCase()}`}>{role}</span>
        </div>
        <div className="panel sidebar-card">
          <p className="label">Atajos</p>
          {isAdmin ? (
            <ul>
              <li>Administrar aerolíneas</li>
              <li>Gestionar aeropuertos</li>
              <li>Ver reportes completos</li>
            </ul>
          ) : isOperator ? (
            <ul>
              <li>Actualizar estados de vuelos</li>
              <li>Ver datos operativos</li>
              <li>Acceder a notificaciones</li>
            </ul>
          ) : (
            <ul>
              <li>Revisar tablero público</li>
              <li>Consultar vuelos recientes</li>
            </ul>
          )}
        </div>
      </aside>

      <main className="dashboard-main">
        <section className="dashboard-cards">
          <section className="panel kpi">
            <h2>Total Vuelos Hoy</h2>
            <p>{data.total_vuelos_hoy}</p>
          </section>
          <section className="panel kpi">
            <h2>Retrasados Hoy</h2>
            <p>{data.retrasados_hoy}</p>
          </section>
          <section className="panel kpi">
            <h2>Cancelados Hoy</h2>
            <p>{data.cancelados_hoy}</p>
          </section>
          <section className="panel kpi">
            <h2>Puntualidad Hoy</h2>
            <p>{data.puntualidad_hoy}%</p>
          </section>
        </section>

        {isPublic ? (
          <section className="panel public-summary">
            <h2>Bienvenido al panel público</h2>
            <p>Tu rol no tiene acceso administrativo. Si deseas, inicia sesión con administrador u operador.</p>
            <p>Visita el <a href="/public-board">tablero público</a> para ver llegadas y salidas.</p>
          </section>
        ) : (
          <section className="panel" style={{ gridColumn: "1/-1" }}>
            <h2>Top Aerolineas Puntuales</h2>
            <table>
              <thead>
                <tr>
                  <th>Aerolinea</th>
                  <th>Total</th>
                  <th>Puntuales</th>
                  <th>% Puntualidad</th>
                </tr>
              </thead>
              <tbody>
                {(data.top_aerolineas_puntuales || []).map((item: any) => (
                  <tr key={item.aerolinea_id}>
                    <td>{item.aerolinea}</td>
                    <td>{item.total_vuelos}</td>
                    <td>{item.vuelos_puntuales}</td>
                    <td>{item.porcentaje_puntualidad}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </main>
>>>>>>> 9578619 (Avance: mejoras en backend y frontend)
    </div>
  );
}