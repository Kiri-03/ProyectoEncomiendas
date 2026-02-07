"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Bus, Lock, User, Loader2 } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { apiClient } from '@/lib/api-client';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Obtener Token (Login)
      // fastapi-users espera 'username' y 'password' en form-data
      const loginResponse = await apiClient.auth.login({
        username: email,
        password: password
      });
      
      const token = loginResponse.access_token;
      if (!token) throw new Error("No se recibió el token de acceso");

      // Guardamos temporalmente para que la siguiente petición (getMe) tenga el token
      localStorage.setItem('translog_user', JSON.stringify({ token }));

      // 2. Obtener datos del usuario
      const user = await apiClient.auth.getMe();

      // 3. Actualizar contexto global
      login({
        id: user.id,
        nombre: user.nombre ? `${user.nombre} ${user.apellido || ''}`.trim() : user.email,
        rol: user.rol,
        token: token
      });

      showSuccess(`Bienvenido, ${user.nombre || 'Usuario'}`);
      navigate('/dashboard');

    } catch (err: any) {
      console.error(err);
      showError("Credenciales inválidas o error de conexión.");
      // Limpiar si falló algo a medias
      localStorage.removeItem('translog_user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="inline-flex p-4 bg-primary rounded-2xl text-white mb-4 shadow-xl shadow-primary/20">
            <Bus className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black italic text-primary tracking-tighter">TRANSLOG</h1>
          <p className="text-slate-500 mt-2">Sistema de Gestión de Encomiendas</p>
        </div>

        <Card className="border-none shadow-2xl">
          <CardHeader>
            <CardTitle>Iniciar Sesión</CardTitle>
            <CardDescription>Ingresa tus credenciales para acceder al panel.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="nombre@empresa.com" 
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full h-11 font-bold" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Entrar al Sistema
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <p className="text-center text-xs text-slate-400">
          © 2024 TransLog Cooperativa. Acceso restringido a personal autorizado.
        </p>
      </div>
    </div>
  );
};

export default Login;