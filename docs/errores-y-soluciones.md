# Errores y Soluciones

## 1) Error de conexion a PostgreSQL

### Sintoma

- `could not connect to server`

### Solucion

- Verificar que PostgreSQL este levantado.
- Revisar credenciales en `backend/.env`.
- Confirmar existencia de la DB `aasana`.

## 2) Error 401 en endpoints protegidos

### Sintoma

- `No autenticado` o `Not authenticated`

### Solucion

- Iniciar sesion en Login.
- Confirmar que el token JWT se guarda en localStorage.
- Revisar expiracion de token y volver a loguear.

## 3) Error 403 por rol

### Sintoma

- `No autorizado`

### Solucion

- Revisar el rol del usuario (ADMINISTRADOR/OPERADOR).
- Usar usuario ADMINISTRADOR para dashboard o eliminar catalogos.

## 4) Error CORS en frontend

### Sintoma

- Bloqueo del navegador al consumir API

### Solucion

- Configurar `CORS_ORIGINS` en `backend/.env` con `http://localhost:3000`.

## 5) Error de dependencias en frontend

### Sintoma

- Fallo al iniciar Next.js

### Solucion

- Ejecutar `npm install` en carpeta frontend.
- Confirmar Node.js 20 o superior.
