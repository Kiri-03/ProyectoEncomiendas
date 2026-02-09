"use client";

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Package, MapPin, Calendar, Truck, CheckCircle2, Clock, Bus, ArrowLeft } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { showError } from '@/utils/toast';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const Tracking = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [encomienda, setEncomienda] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    
    setLoading(true);
    setSearched(true);
    setEncomienda(null);
    setHistory([]);

    try {
      // 1. Obtener datos de la encomienda
      const data = await apiClient.encomiendas.getByTracking(code.trim());
      setEncomienda(data);

      // 2. Obtener historial de rastreo
      const historyData = await apiClient.tracking.getTrackingHistory(code.trim());
      setHistory(historyData);
    } catch (err) {
      console.error(err);
      showError("No se encontró una encomienda con ese código");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar Público Simplificado */}
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Bus className="w-8 h-8 text-primary" />
            <span className="text-xl font-black italic tracking-tighter text-primary">TRANSLOG</span>
          </Link>
          <Link to="/"><Button variant="ghost">Volver al Inicio</Button></Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto py-12 px-4">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-slate-900 mb-4">Rastreo de Envíos</h1>
          <p className="text-slate-500">Ingresa tu código de guía para ver el estado en tiempo real.</p>
        </div>

        <Card className="mb-8 border-none shadow-lg">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input 
                  placeholder="Ej: TL-A1B2C3" 
                  className="pl-10 h-12 text-lg uppercase" 
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>
              <Button type="submit" size="lg" className="h-12 px-8" disabled={loading}>
                {loading ? <Clock className="w-5 h-5 animate-spin" /> : "Rastrear"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {encomienda && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Resumen del Paquete */}
            <Card className="border-slate-200">
              <CardHeader className="bg-slate-50 border-b pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary" /> 
                    {encomienda.tracking_code}
                  </CardTitle>
                  <Badge variant={encomienda.status === 'entregado' ? 'default' : 'secondary'} className="uppercase">
                    {encomienda.status.replace('_', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Origen</p>
                  <p className="font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" /> Quito (Terminal Quitumbe)
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Destino</p>
                  <p className="font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" /> {encomienda.destino_direccion}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Remitente</p>
                  <p className="font-medium">{encomienda.remitente_nombre}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Destinatario</p>
                  <p className="font-medium">{encomienda.destinatario_nombre}</p>
                </div>
              </CardContent>
            </Card>

            {/* Línea de Tiempo */}
            <div className="relative pl-8 border-l-2 border-slate-200 space-y-8 py-2">
              {history.map((event, index) => (
                <div key={index} className="relative">
                  <div className={`absolute -left-[41px] top-0 w-6 h-6 rounded-full border-4 flex items-center justify-center bg-white ${index === 0 ? 'border-primary' : 'border-slate-300'}`}>
                    {index === 0 && <div className="w-2 h-2 bg-primary rounded-full" />}
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                    <p className="text-xs text-slate-400 mb-1">
                      {new Date(event.timestamp).toLocaleString()}
                    </p>
                    <h4 className="font-bold text-slate-800">{event.location}</h4>
                    <p className="text-sm text-slate-600 mt-1">{event.message}</p>
                  </div>
                </div>
              ))}
              
              {/* Estado Inicial */}
              <div className="relative">
                <div className="absolute -left-[41px] top-0 w-6 h-6 rounded-full border-4 border-slate-300 bg-white"></div>
                <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm opacity-70">
                  <p className="text-xs text-slate-400 mb-1">{new Date(encomienda.created_at).toLocaleString()}</p>
                  <h4 className="font-bold text-slate-800">Bodega de Origen</h4>
                  <p className="text-sm text-slate-600 mt-1">Paquete recibido y registrado en sistema.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {searched && !encomienda && !loading && (
          <div className="text-center py-12 text-slate-400">
            <Package className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>No se encontraron resultados para este código.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tracking;