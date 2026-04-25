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
  const { user, isLoading: authLoading } = useRequireAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;
    
    apiGet<DashboardData>("/api/dashboard")
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : "No fue posible cargar dashboard"));
  }, [authLoading]);

  if (authLoading) return <p className="text-muted">Cargando...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!data) return <p className="text-muted">Cargando dashboard...</p>;

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
        )}
      </main>
    </div>
  );
}