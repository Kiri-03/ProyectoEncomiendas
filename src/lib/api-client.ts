const AUTH_SERVICE_URL = "http://localhost:8001";
const ENCOMIENDA_SERVICE_URL = "http://localhost:8002";

export const apiClient = {
  auth: {
    // FastAPI Users usa URLSearchParams para el login (OAuth2 Password Flow)
    login: (credentials: { username: string; password: string }) => {
      const formData = new URLSearchParams();
      formData.append('username', credentials.username);
      formData.append('password', credentials.password);
      
      return fetch(`${AUTH_SERVICE_URL}/auth/jwt/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData
      });
    },
    // Registro usando el esquema UserCreate (nombre, apellido, telefono, rol)
    register: (userData: any) => fetch(`${AUTH_SERVICE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    }),
    me: (token: string) => fetch(`${AUTH_SERVICE_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
  },
  encomiendas: {
    create: (data: any) => fetch(`${ENCOMIENDA_SERVICE_URL}/encomiendas/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
    get: (code: string) => fetch(`${ENCOMIENDA_SERVICE_URL}/encomiendas/${code}`),
  }
};