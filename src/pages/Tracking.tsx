"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Truck, MapPin, Package, CheckCircle2, ArrowRight } from 'lucide-react';
import { MadeWithDyad } from '@/components/made-with-dyad';
import StatusBadge from '@/components/StatusBadge';

const Tracking = () => {
  const [code, setCode] = useState('');
  const [result, setResult] = useState<any>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulación de búsqueda
    if (code === '001-000452') {
      setResult({
        code: '001-000452',
        status: 'en_camino',
        origin: 'Lima',
        destination: 'Trujillo',
        lastUpdate: '2024-03-20 14:30',
        steps: [
          { label: 'Recibido en Oficina', date: '2024-03-20 09:00', completed: true },
          { label: 'En Tránsito', date: '2024-03-20 14:30', completed: true },
          { label: 'Llegada a Destino', date: '-', completed: false },
          { label: 'Entregado', date: '-', completed: false },
        ]
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b p-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-black italic text-primary flex items-center gap-2">
            <Truck className="w-8 h-8" /> TRANSLOG
          </h1>
          <Button variant="ghost" onClick={() => window.location.href = '/'}>Inicio</Button>
        </div>
      </header>

      <main className="flex-1 p-6 flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-extrabold text-slate-900">Rastrea tu Envío</h2>
            <p className="text-slate-500">Ingresa tu código de seguimiento para conocer el estado de tu encomienda.</p>
          </div>

          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input 
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Ej: 001-000452" 
                className="pl-12 h-14 text-lg shadow-sm border-slate-200 focus:ring-primary"
              />
            </div>
            <Button type="submit" size="lg" className="h-14 px-8 font-bold">Rastrear</Button>
          </form>

          {result && (
            <Card className="border-none shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
              <CardHeader className="bg-primary text-white p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-primary-foreground/70 text-xs font-bold uppercase tracking-wider">Código de Seguimiento</p>
                    <CardTitle className="text-2xl font-mono">{result.code}</CardTitle>
                  </div>
                  <StatusBadge status={result.status} className="bg-white/20 border-white/30 text-white" />
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-2 gap-8">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg"><MapPin className="w-5 h-5 text-slate-600" /></div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">Origen</p>
                      <p className="font-bold text-slate-800">{result.origin}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg"><ArrowRight className="w-5 h-5 text-slate-600" /></div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">Destino</p>
                      <p className="font-bold text-slate-800">{result.destination}</p>
                    </div>
                  </div>
                </div>

                <div className="relative space-y-6">
                  <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-slate-100"></div>
                  {result.steps.map((step: any, i: number) => (
                    <div key={i} className="flex items-start gap-4 relative z-10">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm",
                        step.completed ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-400"
                      )}>
                        {step.completed ? <CheckCircle2 className="w-5 h-5" /> : <Package className="w-5 h-5" />}
                      </div>
                      <div className="flex-1 pt-1">
                        <p className={cn("font-bold", step.completed ? "text-slate-900" : "text-slate-400")}>
                          {step.label}
                        </p>
                        <p className="text-xs text-slate-500">{step.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default Tracking;