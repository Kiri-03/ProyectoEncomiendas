"use client";

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Bus, Loader2 } from 'lucide-react';
import { MadeWithDyad } from '@/components/made-with-dyad';
import TrackingResult from '@/components/tracking/TrackingResult';
import { apiClient } from '@/lib/api-client';
import { showError } from '@/utils/toast';

const Tracking = () => {
  const [code, setCode] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;
    
    setLoading(true);
    try {
      const data = await apiClient.tracking.getHistory(code);
      setResult(data);
    } catch (err) {
      showError("No se encontró información para el código proporcionado.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b p-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-black italic text-primary flex items-center gap-2">
            <Bus className="w-8 h-8" /> TRANSLOG
          </h1>
          <Button variant="ghost" onClick={() => window.location.href = '/'}>Inicio</Button>
        </div>
      </header>

      <main className="flex-1 p-6 flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-extrabold text-slate-900">Rastrea tu Encomienda</h2>
            <p className="text-slate-500">Ingresa el número de guía para saber en qué bus viaja tu paquete.</p>
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
            <Button type="submit" size="lg" className="h-14 px-8 font-bold" disabled={loading}>
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Rastrear"}
            </Button>
          </form>

          <TrackingResult result={result} />
        </div>
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default Tracking;