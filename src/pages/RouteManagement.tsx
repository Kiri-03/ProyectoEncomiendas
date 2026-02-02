"use client";

import React from 'react';
import Layout from '@/components/Layout';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Clock, DollarSign, Plus, Search, Trash2, Edit2 } from 'lucide-react';

const MOCK_ROUTES = [
  { id: 1, origin: "Quito (Quitumbe)", destination: "Guayaquil (Pascuales)", duration: "8h 30m", price: 15.50, frequency: "Cada 1 hora" },
  { id: 2, origin: "Quito (Carcelén)", destination: "Ibarra", duration: "2h 15m", price: 4.50, frequency: "Cada 30 min" },
  { id: 3, origin: "Guayaquil", destination: "Cuenca", duration: "4h 00m", price: 10.00, frequency: "Cada 2 horas" },
  { id: 4, origin: "Manta", destination: "Portoviejo", duration: "0h 45m", price: 1.50, frequency: "Cada 15 min" },
];

const RouteManagement = () => {
  return (
    <Layout role="admin">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Gestión de Rutas</h2>
          <p className="text-slate-500">Configura los trayectos, tiempos estimados y tarifas de la cooperativa.</p>
        </div>
        <Button className="gap-2 shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" /> Nueva Ruta
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-lg font-bold">Rutas Activas</CardTitle>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input placeholder="Buscar ruta..." className="pl-10" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50">
                    <TableHead className="font-bold">Trayecto (Origen - Destino)</TableHead>
                    <TableHead className="font-bold">Duración Est.</TableHead>
                    <TableHead className="font-bold">Frecuencia</TableHead>
                    <TableHead className="font-bold text-right">Tarifa Base</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_ROUTES.map((route) => (
                    <TableRow key={route.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-primary/5 rounded-lg text-primary">
                            <MapPin className="w-4 h-4" />
                          </div>
                          <span className="font-medium">{route.origin}</span>
                          <span className="text-slate-400">→</span>
                          <span className="font-medium">{route.destination}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Clock className="w-4 h-4" />
                          {route.duration}
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600">{route.frequency}</TableCell>
                      <TableCell className="text-right font-bold text-primary">
                        ${route.price.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary">
                            <Edit2 className="h-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500">
                            <Trash2 className="h-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default RouteManagement;