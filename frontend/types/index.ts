export type LoginResponse = {
  access_token: string;
  token_type: string;
};

export type Airline = {
  id: number;
  codigo_iata: string;
  nombre: string;
  nombre_corto?: string;
  pais_origen: string;
  activa: boolean;
};

export type Airport = {
  id: number;
  codigo_iata: string;
  codigo_icao?: string;
  nombre: string;
  ciudad: string;
  departamento: string;
  activo: boolean;
};

export type Flight = {
  id: string;
  codigo_vuelo: string;
  aerolinea_id: number;
  aeropuerto_origen_id: number;
  aeropuerto_destino_id: number;
  fecha_vuelo: string;
  hora_salida_programada: string;
  hora_llegada_programada: string;
  estado: string;
  gate?: string;
  terminal?: string;
  minutos_retraso: number;
};

export type UserProfile = {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol_id: number;
  rol_nombre: string;
  activo: boolean;
  creado_en: string;
};
