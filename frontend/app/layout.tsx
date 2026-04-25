import type { Metadata } from "next";
import "./globals.css";
import { MainNav } from "@/components/MainNav";

export const metadata: Metadata = {
  title: "AASANA - Gestion de Vuelos",
  description: "Sistema web de gestion de vuelos en tiempo real",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <div className="bg-grid" />
        <MainNav />
        <main className="app-shell">{children}</main>
      </body>
    </html>
  );
}
