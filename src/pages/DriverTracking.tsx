"use client";

import React, { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bus, MapPin, Navigation, CheckCircle2, Package, Loader2 } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';

const DriverTracking = () => {
  const [buses, setBuses] = useState<any[]>([]);
  const [rutas, setRutas] = useState<any[]>([]);
  
  // Estado de la sesión del conductor
  const [selectedBus, setSelectedBus] = useState<string>('');
  const [selectedRuta, setSelectedRuta] = useState<string>('');
  const [isTripStarted, setIsTripStarted] = useState(false);
  
  // Datos del viaje
  const [checkpoints, setCheckpoints] = useState<any[]>([]);
  const [packagesOnBoard, setPackagesOnBoard] = useState<any[]>([]);
  const [currentCheckpointIndex, setCurrentCheckpointIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [busesData, rutasData] = await Promise.all([
          apiClient.tracking.getBuses(),
          apiClient.tracking.getRutas()
        ]);
        setBuses(busesData);
        setRutas(rutasData);
      } catch (e) {
        showError("Error cargando datos iniciales");
      }
    };
    loadInitialData();
  }, []);

  // Auto-seleccionar bus si el usuario es conductor
  useEffect(() => {
    if (user && buses.length > 0) {
      // Buscamos coincidencia de nombre (ej: "Carlos Ruiz" incluye "Carlos")
      const myBus = buses.find(b => 
        user.nombre.toLowerCase().includes(b.conductor.toLowerCase()) ||
        b.conductor.toLowerCase().includes(user.nombre.toLowerCase())
      );
      
      if (myBus) {
        setSelectedBus(myBus.id);
      }
    }
  }, [user, buses]);

  const handleStartTrip = async () => {
    if (!selectedBus || !selectedRuta) return showError("Seleccione bus y ruta");
    setLoading(true);
    try {
      // 1. Cargar Checkpoints de la ruta
      const cpData = await apiClient.tracking.getCheckpoints(selectedRuta);
      setCheckpoints(cpData);

      // 2. Cargar Encomiendas asignadas a este bus (Simulación de manifiesto)
      const allPackages = await apiClient.encomiendas.getAll();
      // Filtramos paquetes que estén en este bus y no entregados
      const myPackages = allPackages.filter((p: any) => 
        p.bus_id === selectedBus && p.status !== 'entregado'
      );
      
      setPackagesOnBoard(myPackages);
      setIsTripStarted(true);
      showSuccess(`Viaje iniciado con ${myPackages.length} encomiendas`);
    } catch (e) {
      showError("Error al iniciar el viaje");
    } finally {
      setLoading(false);
    }
  };

  const handleReachCheckpoint = async (checkpoint: any, index: number) => {
    if (index <= currentCheckpointIndex) return; // Ya pasado
    
    setLoading(true);
    try {
      const packageIds = packagesOnBoard.map(p => p.tracking_code);
      
      await apiClient.tracking.reachCheckpoint({
        bus_id: selectedBus,
        checkpoint_id: checkpoint.id,
        encomienda_ids: packageIds
      });

      // Actualizar estado de las encomiendas (Sincronización)
      const isLastCheckpoint = index === checkpoints.length - 1;
      const newStatus = isLastCheckpoint ? 'entregado' : 'en_transito';
      
      // Actualizamos el estado de cada paquete en el servicio de encomiendas
      // Nota: En producción esto debería ser un endpoint batch en el backend
      await Promise.all(packagesOnBoard.map(p => 
        apiClient.encomiendas.update(p.id, { status: newStatus })
      ));

      setCurrentCheckpointIndex(index);
      showSuccess(`Llegada a ${checkpoint.nombre} registrada`);
    } catch (e) {
      showError("Error al registrar checkpoint");
    } finally {
      setLoading(false);
    }
  };

  if (!isTripStarted) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-none shadow-2xl">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Bus className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">App Conductor</CardTitle>
            <p className="text-slate-500">Configuración de Viaje</p>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Unidad de Transporte</label>
              <Select 
                onValueChange={setSelectedBus} 
                value={selectedBus}
                disabled={user?.rol === 'conductor' && !!selectedBus} // Bloquear si es conductor y ya se asignó
              >
                <SelectTrigger><SelectValue placeholder="Seleccione su unidad" /></SelectTrigger>
                <SelectContent>
                  {buses.map(bus => (
                    <SelectItem key={bus.id} value={bus.id}>Disco #{bus.numero_disco} - {bus.conductor}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Ruta Asignada</label>
              <Select onValueChange={setSelectedRuta}>
                <SelectTrigger><SelectValue placeholder="Seleccione la ruta" /></SelectTrigger>
                <SelectContent>
                  {rutas.map(ruta => (
                    <SelectItem key={ruta.id} value={ruta.id}>{ruta.origen} ➝ {ruta.destino}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full h-12 text-lg font-bold" onClick={handleStartTrip} disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : "Iniciar Ruta"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-slate-900 text-white p-6 sticky top-0 z-10 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Navigation className="w-5 h-5 text-primary" /> En Ruta
            </h2>
            <p className="text-slate-400 text-sm">Disco {buses.find(b => b.id === selectedBus)?.numero_disco}</p>
          </div>
          <Badge variant="secondary" className="bg-primary text-white border-none px-3 py-1">
            <Package className="w-4 h-4 mr-1" /> {packagesOnBoard.length} Paquetes
          </Badge>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {checkpoints.map((cp, index) => {
          const isPassed = index <= currentCheckpointIndex;
          const isNext = index === currentCheckpointIndex + 1;

          return (
            <div 
              key={cp.id}
              className={`relative p-6 rounded-xl border-2 transition-all ${
                isPassed ? 'bg-emerald-50 border-emerald-500' : 
                isNext ? 'bg-white border-primary shadow-lg scale-105' : 'bg-white border-slate-200 opacity-60'
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isPassed ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                    {isPassed ? <CheckCircle2 className="w-6 h-6" /> : <MapPin className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{cp.nombre}</h3>
                    <p className="text-xs text-slate-500">Orden #{cp.orden}</p>
                  </div>
                </div>
                {isNext && (
                  <Button onClick={() => handleReachCheckpoint(cp, index)} disabled={loading}>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Marcar Llegada"}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
        
        {checkpoints.length === 0 && (
          <div className="text-center p-10 text-slate-500">
            No hay checkpoints configurados para esta ruta.
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverTracking;