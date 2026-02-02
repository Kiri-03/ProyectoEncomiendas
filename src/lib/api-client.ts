// El API Gateway centraliza todos los servicios en un solo puerto (ej: 8000)
const GATEWAY_URL = "http://localhost:8000";

export const apiClient = {
  auth: {
    login: (credentials: any) => fetch(`${GATEWAY_URL}/auth/jwt/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(credentials)
    }),
    me: (token: string) => fetch(`${GATEWAY_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
  },
  encomiendas: {
    create: (data: any) => fetch(`${GATEWAY_URL}/encomiendas/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
    get: (code: string) => fetch(`${GATEWAY_URL}/encomiendas/${code}`),
  },
  tracking: {
    updateGPS: (data: any) => fetch(`${GATEWAY_URL}/tracking/gps-ping`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
    markCheckpoint: (data: any) => fetch(`${GATEWAY_URL}/tracking/checkpoint-reach`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
  },
  payments: {
    process: (data: any) => fetch(`${GATEWAY_URL}/payments/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
    getStatus: (id: string) => fetch(`${GATEWAY_URL}/payments/verify/${id}`)
  }
};