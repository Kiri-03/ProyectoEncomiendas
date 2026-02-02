"use client";

import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  TrendingUp, 
  Users, 
  Building2, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

const REVENUE_DATA = [
  { name: 'Lun', total: 4500 },
  { name: 'Mar', total: 5200 },
  { name: 'Mie', total: 4800 },
  { name: 'Jue', total: 6100 },
  { name: 'Vie', total: 5900 },
  { name: 'Sab', total: 7200 },
  { name: 'Dom', total: 3100 },
];

const OFFICE_PERFORMANCE = [
  { name: 'Lima Central', envios: 1200, ingresos: 15000 },
  { name: 'Trujillo Norte', envios: 850, ingresos: 9200 },
  { name: 'Arequipa Sur', envios: 600, ingresos: 7800 },
  { name: 'Cusco', envios: 450, ingresos: 5400 },
];

const AdminDashboard = () => {
  return (
    <Layout role="admin">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Dashboard Administrativo</h2>
        <p className="text-slate-500">Resumen ejecutivo y rendimiento global de la empresa.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">Ingresos Totales (Mes)</p>
                <h3 className="text-2xl font-bold mt-1">$42,500.00</h3>
                <p className="text-xs text-emerald-600 flex items-center mt-2">
                  <ArrowUpRight className="w-3 h-3 mr-1" /> +12.5% vs mes anterior
                </p>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">Usuarios Activos</p>
                <h3 className="text-2xl font-bold mt-1">124</h3>
                <p className="text-xs text-slate-400 flex items-center mt-2">
                  Personal en todas las sedes
                </p>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <Users className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">Sedes Operativas</p>
                <h3 className="text-2xl font-bold mt-1">12</h3>
                <p className="text-xs text-emerald-600 flex items-center mt-2">
                  2 nuevas este trimestre
                </p>
              </div>
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                <Building2 className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">Tasa de Entrega</p>
                <h3 className="text-2xl font-bold mt-1">98.2%</h3>
                <p className="text-xs text-red-600 flex items-center mt-2">
                  <ArrowDownRight className="w-3 h-3 mr-1" /> -0.4% esta semana
                </p>
              </div>
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Ingresos Semanales</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={REVENUE_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="total" stroke="#0f172a" strokeWidth={3} dot={{ r: 4, fill: '#0f172a' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Rendimiento por Oficina</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={OFFICE_PERFORMANCE}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="ingresos" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminDashboard;