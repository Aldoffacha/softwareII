const TOKEN_KEY = "aasana_token";
const ROLE_KEY = "aasana_role";

export function getToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
  const payload = decodeJwtPayload(token);
  const role = typeof payload?.role === "string" ? payload.role : null;
  if (role) {
    localStorage.setItem(ROLE_KEY, role);
  }
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split(".")[1];
    let base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4 !== 0) {
      base64 += "=";
    }
    const decoded = atob(base64);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export function getRole(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem(ROLE_KEY);
}
