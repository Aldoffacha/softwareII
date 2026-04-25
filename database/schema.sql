-- ============================================================
--  PROYECTO 10: AASANA - Sistema de Gestión de Vuelos
--  Universidad Privada Franz Tamayo
--  Integrantes: Aldo Figueredo, Sebastian Camacho, Mirkof Becerra
--  Gestión I - 2026
-- ============================================================

-- Extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- ============================================================
-- Limpiar esquema (orden inverso de dependencias)
-- ============================================================
DROP TABLE IF EXISTS notificaciones          CASCADE;
DROP TABLE IF EXISTS historial_estados       CASCADE;
DROP TABLE IF EXISTS vuelos                  CASCADE;
DROP TABLE IF EXISTS aerolineas              CASCADE;
DROP TABLE IF EXISTS aeropuertos             CASCADE;
DROP TABLE IF EXISTS rutas                   CASCADE;
DROP TABLE IF EXISTS usuarios                CASCADE;
DROP TABLE IF EXISTS roles                   CASCADE;

DROP TYPE IF EXISTS estado_vuelo_enum;
DROP TYPE IF EXISTS tipo_usuario_enum;
DROP TYPE IF EXISTS tipo_notificacion_enum;

-- ============================================================
-- TIPOS ENUM
-- ============================================================

CREATE TYPE estado_vuelo_enum AS ENUM (
    'PROGRAMADO',
    'ABORDANDO',
    'DESPEGO',
    'ATERRIZO',
    'CANCELADO',
    'RETRASADO',
    'DESVIADO'
);

CREATE TYPE tipo_usuario_enum AS ENUM (
    'ADMINISTRADOR',
    'OPERADOR',
    'PUBLICO'
);

CREATE TYPE tipo_notificacion_enum AS ENUM (
    'EMAIL',
    'CONSULTA',
    'SISTEMA'
);

-- ============================================================
-- TABLA 1: roles
-- ============================================================
CREATE TABLE roles (
    id          SERIAL          PRIMARY KEY,
    nombre      VARCHAR(50)     NOT NULL UNIQUE,
    descripcion TEXT,
    permisos    JSONB           DEFAULT '{}',
    activo      BOOLEAN         NOT NULL DEFAULT TRUE,
    creado_en   TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE roles IS 'Roles del sistema: ADMINISTRADOR, OPERADOR, PUBLICO';

INSERT INTO roles (nombre, descripcion, permisos) VALUES
('ADMINISTRADOR', 'Acceso total al sistema. Gestiona usuarios, aerolíneas y reportes.',
 '{"gestionar_usuarios": true, "gestionar_aerolineas": true, "ver_dashboard": true, "generar_reportes": true}'),
('OPERADOR',      'Registra y actualiza el estado de vuelos en su aeropuerto asignado.',
 '{"registrar_vuelos": true, "actualizar_estado": true, "ver_reportes": true}'),
('PUBLICO',       'Consulta el tablero público de llegadas y salidas. Sin autenticación.',
 '{"ver_tablero": true}');


-- ============================================================
-- TABLA 2: usuarios
-- ============================================================
CREATE TABLE usuarios (
    id              UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre          VARCHAR(100)    NOT NULL,
    apellido        VARCHAR(100)    NOT NULL,
    email           VARCHAR(255)    NOT NULL UNIQUE,
    password_hash   VARCHAR(255)    NOT NULL,
    rol_id          INT             NOT NULL REFERENCES roles(id),
    activo          BOOLEAN         NOT NULL DEFAULT TRUE,
    ultimo_login    TIMESTAMPTZ,
    creado_en       TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    actualizado_en  TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_usuarios_email  ON usuarios(email);
CREATE INDEX idx_usuarios_rol_id ON usuarios(rol_id);

COMMENT ON TABLE  usuarios              IS 'Usuarios del sistema con sus roles';
COMMENT ON COLUMN usuarios.password_hash IS 'Hash bcrypt de la contraseña';


-- ============================================================
-- TABLA 3: aeropuertos
-- ============================================================
CREATE TABLE aeropuertos (
    id              SERIAL          PRIMARY KEY,
    codigo_iata     CHAR(3)         NOT NULL UNIQUE,   -- ej: LPB, VVI, CBB
    codigo_icao     CHAR(4)         UNIQUE,             -- ej: SLLP, SLVR, SLCB
    nombre          VARCHAR(150)    NOT NULL,
    ciudad          VARCHAR(100)    NOT NULL,
    departamento    VARCHAR(100)    NOT NULL,
    altitud_msnm    INT,
    latitud         DECIMAL(9,6),
    longitud        DECIMAL(9,6),
    activo          BOOLEAN         NOT NULL DEFAULT TRUE,
    creado_en       TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE aeropuertos IS '17 aeropuertos administrados por AASANA en Bolivia';

INSERT INTO aeropuertos (codigo_iata, codigo_icao, nombre, ciudad, departamento, altitud_msnm, latitud, longitud) VALUES
('LPB', 'SLLP', 'Aeropuerto Internacional El Alto',       'El Alto',       'La Paz',        4061, -16.5133, -68.1922),
('VVI', 'SLVR', 'Aeropuerto Internacional Viru Viru',     'Santa Cruz',    'Santa Cruz',     373, -17.6448, -63.1354),
('CBB', 'SLCB', 'Aeropuerto Internacional Jorge Wilstermann', 'Cochabamba', 'Cochabamba',   2548, -17.4211, -66.1771),
('SRE', 'SLSU', 'Aeropuerto Juana Azurduy de Padilla',    'Sucre',         'Chuquisaca',    2905, -19.0071, -65.2886),
('ORU', 'SLOR', 'Aeropuerto Juan Mendoza',                'Oruro',         'Oruro',          3703, -17.9626, -67.0763),
('POI', 'SLPO', 'Aeropuerto Capitán Nicolás Rojas',       'Potosí',        'Potosí',         3931, -19.5432, -65.7237),
('TJA', 'SLTJ', 'Aeropuerto Capitán Oriel Lea Plaza',     'Tarija',        'Tarija',          1854, -21.5557, -64.7013),
('TDD', 'SLTD', 'Aeropuerto Teniente Jorge Henrich Arauz','Trinidad',       'Beni',            236, -14.8187, -64.9180),
('BVK', 'SLCA', 'Aeropuerto Capitán Germán Quiroga',      'Cobija',        'Pando',           256, -11.0403, -68.7829);


-- ============================================================
-- TABLA 4: aerolineas
-- ============================================================
CREATE TABLE aerolineas (
    id              SERIAL          PRIMARY KEY,
    codigo_iata     CHAR(2)         NOT NULL UNIQUE,   -- ej: BO, OB, LA
    nombre          VARCHAR(150)    NOT NULL,
    nombre_corto    VARCHAR(50),
    pais_origen     VARCHAR(100)    NOT NULL DEFAULT 'Bolivia',
    logo_url        VARCHAR(500),
    activa          BOOLEAN         NOT NULL DEFAULT TRUE,
    creado_en       TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    actualizado_en  TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE aerolineas IS 'Aerolíneas que operan en aeropuertos de AASANA';

INSERT INTO aerolineas (codigo_iata, nombre, nombre_corto, pais_origen) VALUES
('OB', 'Boliviana de Aviación',           'BoA',         'Bolivia'),
('N5', 'Amaszonas',                       'Amaszonas',   'Bolivia'),
('LA', 'LATAM Airlines',                  'LATAM',       'Chile'),
('4M', 'LASER Airlines / EcoJet',         'EcoJet',      'Bolivia'),
('JJ', 'TAM Linhas Aéreas',               'TAM',         'Brasil'),
('AA', 'American Airlines',               'American',    'Estados Unidos');


-- ============================================================
-- TABLA 5: rutas
-- ============================================================
CREATE TABLE rutas (
    id                  SERIAL      PRIMARY KEY,
    aerolinea_id        INT         NOT NULL REFERENCES aerolineas(id),
    aeropuerto_origen_id  INT       NOT NULL REFERENCES aeropuertos(id),
    aeropuerto_destino_id INT       NOT NULL REFERENCES aeropuertos(id),
    duracion_minutos    INT,
    distancia_km        INT,
    activa              BOOLEAN     NOT NULL DEFAULT TRUE,
    creado_en           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_ruta_distinta CHECK (aeropuerto_origen_id <> aeropuerto_destino_id)
);

CREATE INDEX idx_rutas_aerolinea ON rutas(aerolinea_id);
CREATE INDEX idx_rutas_origen    ON rutas(aeropuerto_origen_id);
CREATE INDEX idx_rutas_destino   ON rutas(aeropuerto_destino_id);

COMMENT ON TABLE rutas IS 'Rutas fijas que sirven de plantilla para programar vuelos';


-- ============================================================
-- TABLA 6: vuelos
-- ============================================================
CREATE TABLE vuelos (
    id                      UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo_vuelo            VARCHAR(10)     NOT NULL,            -- ej: OB-421
    aerolinea_id            INT             NOT NULL REFERENCES aerolineas(id),
    aeropuerto_origen_id    INT             NOT NULL REFERENCES aeropuertos(id),
    aeropuerto_destino_id   INT             NOT NULL REFERENCES aeropuertos(id),

    -- Tiempos programados
    fecha_vuelo             DATE            NOT NULL,
    hora_salida_programada  TIME            NOT NULL,
    hora_llegada_programada TIME            NOT NULL,

    -- Tiempos reales
    hora_salida_real        TIME,
    hora_llegada_real       TIME,

    -- Estado
    estado                  estado_vuelo_enum NOT NULL DEFAULT 'PROGRAMADO',
    gate                    VARCHAR(10),
    terminal                VARCHAR(10),
    motivo_retraso          TEXT,
    minutos_retraso         INT             DEFAULT 0,

    -- Control
    registrado_por          UUID            REFERENCES usuarios(id),
    creado_en               TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    actualizado_en          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_vuelo_aeropuertos_distintos
        CHECK (aeropuerto_origen_id <> aeropuerto_destino_id),
    CONSTRAINT chk_minutos_retraso_positivo
        CHECK (minutos_retraso >= 0)
);

CREATE INDEX idx_vuelos_codigo         ON vuelos(codigo_vuelo);
CREATE INDEX idx_vuelos_fecha          ON vuelos(fecha_vuelo);
CREATE INDEX idx_vuelos_estado         ON vuelos(estado);
CREATE INDEX idx_vuelos_aerolinea      ON vuelos(aerolinea_id);
CREATE INDEX idx_vuelos_origen         ON vuelos(aeropuerto_origen_id);
CREATE INDEX idx_vuelos_destino        ON vuelos(aeropuerto_destino_id);
CREATE INDEX idx_vuelos_fecha_estado   ON vuelos(fecha_vuelo, estado);

COMMENT ON TABLE  vuelos                        IS 'Vuelos programados y su estado en tiempo real';
COMMENT ON COLUMN vuelos.codigo_vuelo           IS 'Código IATA de aerolínea + número, ej: OB-421';
COMMENT ON COLUMN vuelos.minutos_retraso        IS 'Se calcula automáticamente al registrar hora real';


-- ============================================================
-- TABLA 7: historial_estados
-- ============================================================
CREATE TABLE historial_estados (
    id              SERIAL              PRIMARY KEY,
    vuelo_id        UUID                NOT NULL REFERENCES vuelos(id) ON DELETE CASCADE,
    estado_anterior estado_vuelo_enum,
    estado_nuevo    estado_vuelo_enum   NOT NULL,
    comentario      TEXT,
    cambiado_por    UUID                REFERENCES usuarios(id),
    cambiado_en     TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_historial_vuelo_id ON historial_estados(vuelo_id);
CREATE INDEX idx_historial_fecha    ON historial_estados(cambiado_en);

COMMENT ON TABLE historial_estados IS 'Auditoría de todos los cambios de estado de cada vuelo';


-- ============================================================
-- TABLA 8: notificaciones
-- ============================================================
CREATE TABLE notificaciones (
    id              UUID                    PRIMARY KEY DEFAULT uuid_generate_v4(),
    vuelo_id        UUID                    NOT NULL REFERENCES vuelos(id) ON DELETE CASCADE,
    tipo            tipo_notificacion_enum  NOT NULL DEFAULT 'CONSULTA',
    destinatario    VARCHAR(255),           -- email del pasajero (si aplica)
    asunto          VARCHAR(255),
    cuerpo          TEXT                    NOT NULL,
    enviada         BOOLEAN                 NOT NULL DEFAULT FALSE,
    enviada_en      TIMESTAMPTZ,
    creado_en       TIMESTAMPTZ             NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notificaciones_vuelo_id ON notificaciones(vuelo_id);
CREATE INDEX idx_notificaciones_enviada  ON notificaciones(enviada);

COMMENT ON TABLE notificaciones IS 'Notificaciones generadas por cambios de estado (simuladas)';


-- ============================================================
-- FUNCIÓN: actualizar campo updated_at automáticamente
-- ============================================================
CREATE OR REPLACE FUNCTION fn_actualizar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.actualizado_en = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_usuarios_updated
    BEFORE UPDATE ON usuarios
    FOR EACH ROW EXECUTE FUNCTION fn_actualizar_timestamp();

CREATE TRIGGER trg_vuelos_updated
    BEFORE UPDATE ON vuelos
    FOR EACH ROW EXECUTE FUNCTION fn_actualizar_timestamp();

CREATE TRIGGER trg_aerolineas_updated
    BEFORE UPDATE ON aerolineas
    FOR EACH ROW EXECUTE FUNCTION fn_actualizar_timestamp();


-- ============================================================
-- FUNCIÓN + TRIGGER: registrar historial automáticamente
-- al cambiar estado de vuelo
-- ============================================================
CREATE OR REPLACE FUNCTION fn_registrar_historial_estado()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.estado IS DISTINCT FROM NEW.estado THEN
        INSERT INTO historial_estados (vuelo_id, estado_anterior, estado_nuevo)
        VALUES (NEW.id, OLD.estado, NEW.estado);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_vuelos_historial
    AFTER UPDATE OF estado ON vuelos
    FOR EACH ROW EXECUTE FUNCTION fn_registrar_historial_estado();


-- ============================================================
-- FUNCIÓN: calcular minutos de retraso automáticamente
-- ============================================================
CREATE OR REPLACE FUNCTION fn_calcular_retraso()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.hora_salida_real IS NOT NULL AND NEW.hora_salida_programada IS NOT NULL THEN
        NEW.minutos_retraso := GREATEST(0,
            EXTRACT(EPOCH FROM (NEW.hora_salida_real - NEW.hora_salida_programada)) / 60
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_vuelos_retraso
    BEFORE INSERT OR UPDATE OF hora_salida_real ON vuelos
    FOR EACH ROW EXECUTE FUNCTION fn_calcular_retraso();


-- ============================================================
-- VISTAS útiles para los endpoints de reportes
-- ============================================================

-- Vista: tablero público (sin datos sensibles)
CREATE OR REPLACE VIEW v_tablero_publico AS
SELECT
    v.id,
    v.codigo_vuelo,
    a.nombre_corto                      AS aerolinea,
    a.codigo_iata                       AS codigo_aerolinea,
    orig.codigo_iata                    AS origen_iata,
    orig.ciudad                         AS origen_ciudad,
    dest.codigo_iata                    AS destino_iata,
    dest.ciudad                         AS destino_ciudad,
    v.fecha_vuelo,
    v.hora_salida_programada,
    v.hora_llegada_programada,
    v.hora_salida_real,
    v.hora_llegada_real,
    v.estado,
    v.gate,
    v.terminal,
    v.minutos_retraso
FROM vuelos v
JOIN aerolineas  a    ON v.aerolinea_id           = a.id
JOIN aeropuertos orig ON v.aeropuerto_origen_id   = orig.id
JOIN aeropuertos dest ON v.aeropuerto_destino_id  = dest.id;

COMMENT ON VIEW v_tablero_publico IS 'Vista para el portal público. Sin datos internos.';


-- Vista: puntualidad por aerolínea (reporte gerencial)
CREATE OR REPLACE VIEW v_puntualidad_aerolinea AS
SELECT
    a.id                                        AS aerolinea_id,
    a.nombre                                    AS aerolinea,
    a.codigo_iata,
    COUNT(v.id)                                 AS total_vuelos,
    COUNT(v.id) FILTER (
        WHERE v.estado = 'DESPEGO'
          AND (v.minutos_retraso = 0 OR v.minutos_retraso IS NULL)
    )                                           AS vuelos_puntuales,
    COUNT(v.id) FILTER (
        WHERE v.estado IN ('RETRASADO', 'DESPEGO') AND v.minutos_retraso > 0
    )                                           AS vuelos_retrasados,
    COUNT(v.id) FILTER (
        WHERE v.estado = 'CANCELADO'
    )                                           AS vuelos_cancelados,
    ROUND(AVG(v.minutos_retraso) FILTER (
        WHERE v.minutos_retraso > 0
    ), 1)                                       AS retraso_promedio_min,
    ROUND(
        COUNT(v.id) FILTER (
            WHERE v.estado = 'DESPEGO'
              AND (v.minutos_retraso = 0 OR v.minutos_retraso IS NULL)
        ) * 100.0 / NULLIF(COUNT(v.id), 0), 1
    )                                           AS porcentaje_puntualidad
FROM aerolineas a
LEFT JOIN vuelos v ON v.aerolinea_id = a.id
GROUP BY a.id, a.nombre, a.codigo_iata;

COMMENT ON VIEW v_puntualidad_aerolinea IS 'Reporte de puntualidad agrupado por aerolínea';


-- Vista: vuelos por día (dashboard gerencial)
CREATE OR REPLACE VIEW v_vuelos_por_dia AS
SELECT
    fecha_vuelo,
    COUNT(*)                                        AS total,
    COUNT(*) FILTER (WHERE estado = 'PROGRAMADO')   AS programados,
    COUNT(*) FILTER (WHERE estado = 'DESPEGO')      AS despegados,
    COUNT(*) FILTER (WHERE estado = 'ATERRIZO')     AS aterrizados,
    COUNT(*) FILTER (WHERE estado = 'RETRASADO')    AS retrasados,
    COUNT(*) FILTER (WHERE estado = 'CANCELADO')    AS cancelados,
    ROUND(AVG(minutos_retraso) FILTER (
        WHERE minutos_retraso > 0
    ), 1)                                           AS retraso_promedio_min
FROM vuelos
GROUP BY fecha_vuelo
ORDER BY fecha_vuelo DESC;

COMMENT ON VIEW v_vuelos_por_dia IS 'Resumen diario de vuelos para el dashboard';


-- ============================================================
-- DATOS DE PRUEBA (seed) - usuarios del sistema
-- ============================================================
-- Contraseñas: todas son "Password123!" hasheadas con bcrypt
-- Hash real generado con bcrypt cost=12:
-- $2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TiGfmHbFDvDDfFB6QBjE3xFkjXe6

INSERT INTO usuarios (nombre, apellido, email, password_hash, rol_id) VALUES
('Admin',     'AASANA',    'admin@aasana.gob.bo',    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TiGfmHbFDvDDfFB6QBjE3xFkjXe6', 1),
('Carlos',    'Mamani',    'operador1@aasana.gob.bo', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TiGfmHbFDvDDfFB6QBjE3xFkjXe6', 2),
('Rosa',      'Quispe',    'operador2@aasana.gob.bo', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TiGfmHbFDvDDfFB6QBjE3xFkjXe6', 2);


-- ============================================================
-- DATOS DE PRUEBA - vuelos de ejemplo
-- ============================================================
INSERT INTO vuelos (
    codigo_vuelo, aerolinea_id,
    aeropuerto_origen_id, aeropuerto_destino_id,
    fecha_vuelo, hora_salida_programada, hora_llegada_programada,
    estado, gate, terminal
) VALUES
('OB-421',  1, 1, 2, CURRENT_DATE,       '06:00', '07:30', 'PROGRAMADO',  'G1', 'T1'),
('OB-422',  1, 2, 1, CURRENT_DATE,       '09:00', '10:30', 'ABORDANDO',   'G3', 'T1'),
('N5-101',  2, 1, 3, CURRENT_DATE,       '07:30', '08:20', 'DESPEGO',     'G2', 'T1'),
('LA-803',  3, 2, 1, CURRENT_DATE,       '11:00', '12:30', 'RETRASADO',   'G5', 'T2'),
('OB-523',  1, 3, 2, CURRENT_DATE,       '14:00', '15:10', 'PROGRAMADO',  'G4', 'T1'),
('4M-210',  4, 1, 4, CURRENT_DATE,       '16:30', '17:45', 'PROGRAMADO',  'G6', 'T1'),
('OB-621',  1, 1, 2, CURRENT_DATE + 1,   '06:00', '07:30', 'PROGRAMADO',  'G1', 'T1'),
('N5-205',  2, 2, 5, CURRENT_DATE + 1,   '08:00', '09:30', 'PROGRAMADO',  'G2', 'T2'),
('LA-804',  3, 1, 2, CURRENT_DATE - 1,   '09:00', '10:30', 'ATERRIZO',    'G3', 'T1'),
('OB-319',  1, 2, 3, CURRENT_DATE - 1,   '13:00', '14:10', 'CANCELADO',   'G5', 'T1');

-- Actualizar el vuelo retrasado con datos reales
UPDATE vuelos
SET hora_salida_real = '11:45',
    motivo_retraso   = 'Demora técnica en mantenimiento de aeronave'
WHERE codigo_vuelo = 'LA-803';


-- ============================================================
-- Verificación final
-- ============================================================
DO $$
DECLARE
    cnt_tablas  INT;
    cnt_vuelos  INT;
    cnt_users   INT;
BEGIN
    SELECT COUNT(*) INTO cnt_tablas
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE';

    SELECT COUNT(*) INTO cnt_vuelos FROM vuelos;
    SELECT COUNT(*) INTO cnt_users  FROM usuarios;

    RAISE NOTICE '=========================================';
    RAISE NOTICE 'AASANA DB inicializada correctamente';
    RAISE NOTICE 'Tablas creadas : %', cnt_tablas;
    RAISE NOTICE 'Vuelos de prueba: %', cnt_vuelos;
    RAISE NOTICE 'Usuarios creados: %', cnt_users;
    RAISE NOTICE '=========================================';
END $$;