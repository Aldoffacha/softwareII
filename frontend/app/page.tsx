"use client";

import { FormEvent, useState } from "react";
import { apiSend } from "@/lib/api";
import { setToken } from "@/lib/auth";
import { LoginResponse } from "@/types";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@aasana.gob.bo");
  const [password, setPassword] = useState("Admin123!");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    try {
      const data = await apiSend<LoginResponse>("/api/auth/login", "POST", { email, password });
      setToken(data.access_token);
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err instanceof Error ? err.message : "No fue posible iniciar sesion");
    }
  }

  return (
    <section className="panel" style={{ maxWidth: 560, margin: "2rem auto" }}>
      <h1>Ingreso al Sistema AASANA</h1>
      <p>Administra vuelos, estados y reportes en tiempo real.</p>
      
      <form onSubmit={onSubmit} className="grid">
        <div>
          <label>Email</label>
          <input title="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Contrasena</label>
          <input title="Contrasena" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">Ingresar</button>
      </form>
      {error ? <p className="error">{error}</p> : null}
    </section>
  );
}
