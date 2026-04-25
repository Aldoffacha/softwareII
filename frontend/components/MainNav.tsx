"use client";

import Link from "next/link";
import { clearToken, getRole, getToken } from "@/lib/auth";
import { useEffect, useState } from "react";

export function MainNav() {
  const [logged, setLogged] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    setLogged(Boolean(getToken()));
    setRole(getRole());
  }, []);

  function logout() {
    clearToken();
    window.location.href = "/";
  }

  return (
    <header className="nav">
      <div className="nav-inner">
        <div className="brand">AASANA | Gestion de Vuelos</div>
        <nav className="nav-links">
            {!logged ? (
              <>
                <Link href="/">Login</Link>
                <Link href="/public-board">Tablero Publico</Link>
              </>
            ) : (
              <>
                <Link href="/dashboard">Dashboard</Link>
                <Link href="/public-board">Tablero Publico</Link>
                {role !== "PUBLICO" ? <Link href="/flights">Vuelos</Link> : null}
                {role === "ADMINISTRADOR" ? <Link href="/flights/new">Registrar Vuelo</Link> : null}
                {role !== "PUBLICO" ? <Link href="/reports">Reportes</Link> : null}
                {role === "ADMINISTRADOR" ? <Link href="/airlines">Aerolineas</Link> : null}
                {role === "ADMINISTRADOR" ? <Link href="/airports">Aeropuertos</Link> : null}
              </>
            )}
        </nav>
        {logged ? <button onClick={logout}>Salir</button> : null}
      </div>
    </header>
  );
}
