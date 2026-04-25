-- ============================================================
--  AASANA - Datos de prueba adicionales (seed extendido)
--  Ejecutar DESPUÉS de schema.sql
-- ============================================================

-- ============================================================
-- Usuarios del sistema (Aldo, Sebastian)
-- ============================================================
INSERT INTO usuarios (nombre, apellido, email, password_hash, rol_id) VALUES
('Aldo', 'Figueredo', 'aldo@aasana.com', '$2b$12$l2NeC.uO8cRgC5bmzh74o.YXmo.LZPjO0hzrx7.bq9A7QFBjPLCJK', 1),
('Sebastian', 'Camacho', 'sebastian@aasana.com', '$2b$12$l2NeC.uO8cRgC5bmzh74o.YXmo.LZPjO0hzrx7.bq9A7QFBjPLCJK', 1);

-- ============================================================
-- Más rutas
-- ============================================================
INSERT INTO rutas (aerolinea_id, aeropuerto_origen_id, aeropuerto_destino_id, duracion_minutos, distancia_km) VALUES
(1, 1, 2, 90,  882),   -- BoA: LPB -> VVI
(1, 2, 1, 90,  882),   -- BoA: VVI -> LPB
(1, 1, 3, 50,  366),   -- BoA: LPB -> CBB
(1, 3, 2, 55,  581),   -- BoA: CBB -> VVI
(2, 1, 8, 60,  530),   -- Amaszonas: LPB -> TDD
(2, 2, 8, 70,  645),   -- Amaszonas: VVI -> TDD
(3, 2, 1, 90,  882),   -- LATAM:     VVI -> LPB
(4, 1, 4, 75,  612);   -- EcoJet:    LPB -> SRE


-- ============================================================
-- Vuelos históricos para reportes de puntualidad (últimos 30 días)
-- ============================================================
INSERT INTO vuelos (
    codigo_vuelo, aerolinea_id,
    aeropuerto_origen_id, aeropuerto_destino_id,
    fecha_vuelo, hora_salida_programada, hora_llegada_programada,
    hora_salida_real, estado, minutos_retraso, gate
) VALUES
-- Vuelos puntuales BoA
('OB-001', 1, 1, 2, CURRENT_DATE -  2, '06:00', '07:30', '06:02', 'DESPEGO',   0,   'G1'),
('OB-002', 1, 2, 1, CURRENT_DATE -  2, '09:00', '10:30', '09:00', 'ATERRIZO',  0,   'G2'),
('OB-003', 1, 1, 3, CURRENT_DATE -  3, '07:30', '08:20', '07:35', 'ATERRIZO',  0,   'G1'),
('OB-004', 1, 3, 2, CURRENT_DATE -  4, '14:00', '15:10', '14:00', 'DESPEGO',   0,   'G3'),
-- Vuelos retrasados BoA
('OB-005', 1, 1, 2, CURRENT_DATE -  5, '06:00', '07:30', '06:45', 'DESPEGO',   45,  'G1'),
('OB-006', 1, 2, 3, CURRENT_DATE -  6, '10:00', '11:10', '10:20', 'ATERRIZO',  20,  'G4'),
-- Vuelos Amaszonas
('N5-001', 2, 1, 8, CURRENT_DATE -  2, '07:00', '08:00', '07:05', 'DESPEGO',   0,   'G2'),
('N5-002', 2, 8, 1, CURRENT_DATE -  3, '10:00', '11:00', '10:35', 'ATERRIZO',  35,  'G2'),
('N5-003', 2, 1, 3, CURRENT_DATE -  4, '08:30', '09:20', '08:30', 'DESPEGO',   0,   'G3'),
-- Vuelos LATAM
('LA-001', 3, 2, 1, CURRENT_DATE -  2, '11:00', '12:30', '11:00', 'ATERRIZO',  0,   'G5'),
('LA-002', 3, 1, 2, CURRENT_DATE -  3, '15:00', '16:30', '15:55', 'DESPEGO',   55,  'G5'),
('LA-003', 3, 2, 1, CURRENT_DATE -  7, '11:00', '12:30', '12:10', 'ATERRIZO',  70,  'G5'),
-- Cancelados
('OB-CX1', 1, 1, 2, CURRENT_DATE -  8, '06:00', '07:30', NULL,    'CANCELADO', 0,   'G1'),
('N5-CX1', 2, 1, 8, CURRENT_DATE - 10, '07:00', '08:00', NULL,    'CANCELADO', 0,   'G2'),
-- EcoJet
('4M-001', 4, 1, 4, CURRENT_DATE -  2, '16:30', '17:45', '16:30', 'ATERRIZO',  0,   'G6'),
('4M-002', 4, 4, 1, CURRENT_DATE -  3, '18:00', '19:15', '18:30', 'ATERRIZO',  30,  'G6');


-- ============================================================
-- Notificaciones de ejemplo
-- ============================================================
INSERT INTO notificaciones (vuelo_id, tipo, destinatario, asunto, cuerpo, enviada, enviada_en)
SELECT
    v.id,
    'EMAIL',
    'pasajero@example.com',
    'Actualización de su vuelo ' || v.codigo_vuelo,
    'Estimado pasajero, le informamos que su vuelo ' || v.codigo_vuelo ||
    ' con destino ' || ap.ciudad ||
    ' presenta un retraso de ' || v.minutos_retraso || ' minutos. ' ||
    'Disculpe los inconvenientes causados.',
    TRUE,
    NOW() - INTERVAL '1 hour'
FROM vuelos v
JOIN aeropuertos ap ON ap.id = v.aeropuerto_destino_id
WHERE v.minutos_retraso > 0
LIMIT 5;

-- Notificación de cancelación
INSERT INTO notificaciones (vuelo_id, tipo, destinatario, asunto, cuerpo, enviada, enviada_en)
SELECT
    v.id,
    'EMAIL',
    'pasajero@example.com',
    'IMPORTANTE: Vuelo ' || v.codigo_vuelo || ' cancelado',
    'Le informamos la cancelación del vuelo ' || v.codigo_vuelo ||
    '. Por favor comuníquese con la aerolínea para reprogramar.',
    TRUE,
    NOW() - INTERVAL '2 hours'
FROM vuelos v
WHERE v.estado = 'CANCELADO'
LIMIT 2;


-- ============================================================
-- Verificación del seed
-- ============================================================
SELECT 'Roles'         AS tabla, COUNT(*) AS registros FROM roles
UNION ALL
SELECT 'Usuarios',       COUNT(*) FROM usuarios
UNION ALL
SELECT 'Aeropuertos',    COUNT(*) FROM aeropuertos
UNION ALL
SELECT 'Aerolíneas',     COUNT(*) FROM aerolineas
UNION ALL
SELECT 'Rutas',          COUNT(*) FROM rutas
UNION ALL
SELECT 'Vuelos',         COUNT(*) FROM vuelos
UNION ALL
SELECT 'Historial',      COUNT(*) FROM historial_estados
UNION ALL
SELECT 'Notificaciones', COUNT(*) FROM notificaciones;

-- Vista rápida del tablero público
SELECT codigo_vuelo, aerolinea, origen_ciudad, destino_ciudad,
       hora_salida_programada, estado, minutos_retraso
FROM v_tablero_publico
ORDER BY fecha_vuelo, hora_salida_programada
LIMIT 10;