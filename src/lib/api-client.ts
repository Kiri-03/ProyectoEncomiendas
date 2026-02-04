"use client";

const GATEWAY_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function request(endpoint: string, options: RequestInit = {}) {
  const savedUser = localStorage.getItem('translog_user');
  const token = savedUser ? JSON.parse(savedUser).token : null;

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${GATEWAY_URL}${endpoint}`, { ...options, headers });
  
  if (response.status === 401) {
    localStorage.removeItem('translog_user');
    window.location.href = '/login';
    throw new Error("Sesión expirada");
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Error en la petición");
  }

  return response.json();
}

export const apiClient = {
  auth: {
    login: (data: any) => request('/auth/jwt/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(data)
    }),
    getMe: () => request('/auth/users/me'),
  },
  encomiendas: {
    getAll: () => request('/encomiendas/'),
    getOne: (id: string) => request(`/encomiendas/${id}`),
    create: (data: any) => request('/encomiendas/', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    updateStatus: (id: string, status: string) => request(`/encomiendas/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    }),
  },
  usuarios: {
    list: () => request('/auth/users'),
    create: (data: any) => request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  },
  tracking: {
    getHistory: (code: string) => request(`/tracking/${code}`),
  }
};