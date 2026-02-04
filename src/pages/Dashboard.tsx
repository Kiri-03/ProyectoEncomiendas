"use client";

import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Package, Truck, CheckCircle, Clock, Plus, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import EncomiendaTable from '@/components/EncomiendaTable';
import { Link } from 'react-router-dom';
import { apiClient } from '@/lib/api-client';
import { showError } from '@/utils/toast';

const Dashboard = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { title: 'Pendientes', value: '0', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
    { title: 'En Camino', value: '0', icon: Truck, color: 'text-blue-500', bg: 'bg-blue-50' },
    { title: 'Entregados', value: '0', icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { title: 'Total Hoy', value: '0', icon: Package, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const encomiendas = await apiClient.encomiendas.getAll();
        setData(encomiendas);
        
        // Calcular stats reales
        const pending = encomiendas.filter((e: any) => e.status === 'en_bodega_origen').length;
        const transit = encomiendas.filter((e: any) => e.status === 'en_transito').length;
        const delivered = encomiendas.filter((e: any) => e.status === 'entregado').length;

        setStats([
          { title: 'Pendientes', value: pending.toString(), icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
          { title: 'En Camino', value: transit.toString(), icon: Truck, color: 'text-blue-500', bg: 'bg-blue-50' },
          { title: 'Entregados', value: delivered.toString(), icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { title: 'Total Hoy', value: encomiendas.length.toString(), icon: Package, color: 'text-indigo-500', bg: 'bg-indigo-50' },
        ]);
      } catch (err) {
        showError("No se pudieron cargar los datos del servidor.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Panel de Control</h2>
          <p className="text-slate-500">Gestión de encomiendas en tiempo real desde el servidor.</p>
        </div>
        <Link to="/encomiendas/nueva">
          <Button className="gap-2 shadow-lg shadow-primary/20">
            <Plus className="w-4 h-4" /> Nueva Encomienda
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-xl font-bold text-slate-800">Envíos Recientes</h3>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Buscar por código o cliente..." className="pl-10 bg-white border-slate-200" />
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : (
          <EncomiendaTable data={data} />
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;