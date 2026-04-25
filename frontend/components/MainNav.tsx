"use client";

import Link from "next/link";
import { clearToken, getToken } from "@/lib/auth";
import { useEffect, useState } from "react";

export function MainNav() {
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    setLogged(Boolean(getToken()));
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
          <Link href="/">Login</Link>
          <Link href="/public-board">Tablero Publico</Link>
          <Link href="/flights">Vuelos</Link>
          <Link href="/flights/new">Registrar Vuelo</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/reports">Reportes</Link>
          <Link href="/airlines">Aerolineas</Link>
          <Link href="/airports">Aeropuertos</Link>
        </nav>
        {logged ? <button onClick={logout}>Salir</button> : null}
      </div>
    </header>
  );
}
