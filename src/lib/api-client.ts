const AUTH_SERVICE_URL = "http://localhost:8001";
const ENCOMIENDA_SERVICE_URL = "http://localhost:8002";
const TRACKING_SERVICE_URL = "http://localhost:8003";
const PAYMENT_SERVICE_URL = "http://localhost:8004";

export const apiClient = {
  auth: {
    login: (credentials: any) => fetch(`${AUTH_SERVICE_URL}/auth/jwt/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(credentials)
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
  },
  tracking: {
    // Estos endpoints serán consumidos principalmente por la App Móvil
    updateGPS: (data: any) => fetch(`${TRACKING_SERVICE_URL}/gps-ping`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
    markCheckpoint: (data: any) => fetch(`${TRACKING_SERVICE_URL}/checkpoint-reach`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
  },
  payments: {
    process: (data: any) => fetch(`${PAYMENT_SERVICE_URL}/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
    getStatus: (id: string) => fetch(`${PAYMENT_SERVICE_URL}/verify/${id}`)
  }
};