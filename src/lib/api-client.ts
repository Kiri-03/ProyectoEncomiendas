const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const getHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const session = localStorage.getItem('translog_user');
  if (session) {
    try {
      const { token } = JSON.parse(session);
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    } catch (e) {
      // Silent error
    }
  }
  return headers;
};

export const apiClient = {
  encomiendas: {
    getAll: async () => {
      const res = await fetch(`${BASE_URL}/encomiendas/`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Error fetching encomiendas');
      return res.json();
    },
    create: async (data: any) => {
      const res = await fetch(`${BASE_URL}/encomiendas/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Error creating encomienda');
      return res.json();
    },
    getTerminals: async () => {
      const res = await fetch(`${BASE_URL}/encomiendas/terminals`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Error fetching terminals');
      return res.json();
    },
    getStats: async () => {
      const res = await fetch(`${BASE_URL}/encomiendas/stats/dashboard`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Error fetching stats');
      return res.json();
    },
    getByTracking: async (code: string) => {
      const res = await fetch(`${BASE_URL}/encomiendas/${code}`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Error fetching encomienda');
      return res.json();
    }
  },
  tracking: {
    getBuses: async () => {
      const res = await fetch(`${BASE_URL}/tracking/buses`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Error fetching buses');
      return res.json();
    },
    getRutas: async () => {
      const res = await fetch(`${BASE_URL}/tracking/rutas`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Error fetching rutas');
      return res.json();
    },
    createRuta: async (data: any) => {
      const res = await fetch(`${BASE_URL}/tracking/rutas`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Error creating ruta');
      return res.json();
    },
    updateRuta: async (id: string, data: any) => {
      const res = await fetch(`${BASE_URL}/tracking/rutas/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Error updating ruta');
      return res.json();
    },
    deleteRuta: async (id: string) => {
      const res = await fetch(`${BASE_URL}/tracking/rutas/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Error deleting ruta');
      return res.json();
    }
  },
  auth: {
    login: async (data: any) => {
      const formData = new URLSearchParams();
      formData.append('username', data.username);
      formData.append('password', data.password);

      const res = await fetch(`${BASE_URL}/auth/jwt/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });
      if (!res.ok) throw new Error('Login failed');
      return res.json();
    },
    getMe: async () => {
      const res = await fetch(`${BASE_URL}/auth/users/me`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Error fetching current user');
      return res.json();
    },
    getUsers: async () => {
      const res = await fetch(`${BASE_URL}/auth/users`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Error fetching users');
      return res.json();
    },
    register: async (data: any) => {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Error registering user');
      return res.json();
    },
    updateUser: async (id: string, data: any) => {
      const res = await fetch(`${BASE_URL}/auth/users/${id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Error updating user');
      return res.json();
    },
    deleteUser: async (id: string) => {
      const res = await fetch(`${BASE_URL}/auth/users/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Error deleting user');
      if (res.status === 204) return; // No content
      return res.json(); 
    }
  }
};