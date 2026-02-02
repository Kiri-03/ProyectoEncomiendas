import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { title: 'Pendientes', value: '12', icon: Clock, color: 'text-amber-500' },
    { title: 'En Camino', value: '08', icon: Truck, color: 'text-blue-500' },
    { title: 'Entregados', value: '45', icon: CheckCircle, color: 'text-emerald-500' },
    { title: 'Total Hoy', value: '65', icon: Package, color: 'text-indigo-500' },
  ];

  return (
    <Layout>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Panel de Control</h2>
        <p className="text-slate-500">Resumen de operaciones de la oficina actual.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">{stat.title}</CardTitle>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-slate-400">
            <Package className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>No hay encomiendas registradas recientemente.</p>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Dashboard;