const AUTH_SERVICE_URL = "http://localhost:8001";
const ENCOMIENDA_SERVICE_URL = "http://localhost:8002";

export const apiClient = {
  auth: {
    login: (credentials: any) => fetch(`${AUTH_SERVICE_URL}/auth/jwt/login`, {
      method: 'POST',
      body: new URLSearchParams(credentials)
    }),
    register: (userData: any) => fetch(`${AUTH_SERVICE_URL}/auth/register`, {
      method: 'POST',
      body: JSON.stringify(userData)
    }),
  },
  encomiendas: {
    create: (data: any) => fetch(`${ENCOMIENDA_SERVICE_URL}/encomiendas/`, {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    get: (code: string) => fetch(`${ENCOMIENDA_SERVICE_URL}/encomiendas/${code}`),
  }
};