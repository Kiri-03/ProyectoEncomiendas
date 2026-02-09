"use client";

import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Plus, Trash2, Map, Navigation, Save, Loader2, Edit, X } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api-client';

const RouteManagement = () => {
  const [rutas, setRutas] = useState<any[]>([]);
  const [selectedRuta, setSelectedRuta] = useState<any | null>(null);
  const [checkpoints, setCheckpoints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingCheckpoints, setLoadingCheckpoints] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form States
  const [newRuta, setNewRuta] = useState({ origen: '', destino: '', duracion: '', precio_base: 0 });
  const [newCheckpoint, setNewCheckpoint] = useState({ nombre: '', orden: 1, lat: 0, lng: 0 });

  const fetchRutas = async () => {
    try {
      const data = await apiClient.tracking.getRutas();
      setRutas(data);
    } catch (err) {
      console.error("Error en fetchRutas:", err);
      showError("Error al cargar rutas");
    } finally {
      setLoading(false);
    }
  };

  const fetchCheckpoints = async (rutaId: string) => {
    setLoadingCheckpoints(true);
    try {
      const data = await apiClient.tracking.getCheckpoints(rutaId);
      setCheckpoints(data);
    } catch (err) {
      console.error("Error en fetchCheckpoints:", err);
      showError("Error al cargar checkpoints");
    } finally {
      setLoadingCheckpoints(false);
    }
  };

  useEffect(() => {
    fetchRutas();
  }, []);

  useEffect(() => {
    if (selectedRuta) {
      fetchCheckpoints(selectedRuta.id);
      // Resetear form de checkpoint con el siguiente orden lógico
      setNewCheckpoint(prev => ({ ...prev, orden: checkpoints.length + 1 }));
    } else {
      setCheckpoints([]);
    }
  }, [selectedRuta]);

  const handleCreateOrUpdateRuta = async () => {
    if (!newRuta.origen || !newRuta.destino) return showError("Complete origen y destino");
    try {
      if (isEditing && selectedRuta) {
        await apiClient.tracking.updateRuta(selectedRuta.id, { ...newRuta, estado: selectedRuta.estado });
        showSuccess("Ruta actualizada");
      } else {
        await apiClient.tracking.createRuta({ ...newRuta, estado: 'activa' });
        showSuccess("Ruta creada");
      }
      setNewRuta({ origen: '', destino: '', duracion: '', precio_base: 0 });
      setIsEditing(false);
      fetchRutas();
    } catch (err) {
      showError(isEditing ? "Error al actualizar ruta" : "Error al crear ruta");
    }
  };

  const handleEditRuta = (ruta: any) => {
    setNewRuta({
      origen: ruta.origen,
      destino: ruta.destino,
      duracion: ruta.duracion,
      precio_base: ruta.precio_base
    });
    setSelectedRuta(ruta);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setNewRuta({ origen: '', destino: '', duracion: '', precio_base: 0 });
    setIsEditing(false);
  };

  const handleDeleteRuta = async (id: string) => {
    if (!confirm("¿Eliminar ruta y sus checkpoints?")) return;
    try {
      await apiClient.tracking.deleteRuta(id);
      showSuccess("Ruta eliminada");
      if (selectedRuta?.id === id) setSelectedRuta(null);
      fetchRutas();
    } catch (err) {
      showError("Error al eliminar ruta");
    }
  };

  const handleCreateCheckpoint = async () => {
    if (!selectedRuta) return;
    if (!newCheckpoint.nombre) return showError("Nombre del checkpoint requerido");
    
    try {
      await apiClient.tracking.createCheckpoint(selectedRuta.id, newCheckpoint);
      showSuccess("Checkpoint agregado");
      fetchCheckpoints(selectedRuta.id);
      setNewCheckpoint({ nombre: '', orden: checkpoints.length + 2, lat: 0, lng: 0 });
    } catch (err) {
      showError("Error al agregar checkpoint");
    }
  };

  const handleDeleteCheckpoint = async (id: string) => {
    try {
      await apiClient.tracking.deleteCheckpoint(id);
      showSuccess("Checkpoint eliminado");
      if (selectedRuta) fetchCheckpoints(selectedRuta.id);
    } catch (err) {
      showError("Error al eliminar checkpoint");
    }
  };

  return (
    <Layout role="administrador">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Gestión de Rutas y Checkpoints</h2>
        <p className="text-slate-500">Configura los trayectos y sus puntos de control para el rastreo.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Panel Izquierdo: Lista de Rutas */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Map className="w-5 h-5 text-primary" /> Rutas Activas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {/* Formulario Nueva Ruta */}
              <div className="p-4 bg-slate-50 rounded-lg space-y-3 border border-slate-100">
                <Label className="text-xs font-bold text-slate-500 uppercase">{isEditing ? 'Editar Ruta' : 'Nueva Ruta'}</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Origen" value={newRuta.origen} onChange={e => setNewRuta({...newRuta, origen: e.target.value})} className="bg-white" />
                  <Input placeholder="Destino" value={newRuta.destino} onChange={e => setNewRuta({...newRuta, destino: e.target.value})} className="bg-white" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Duración (ej: 2h)" value={newRuta.duracion} onChange={e => setNewRuta({...newRuta, duracion: e.target.value})} className="bg-white" />
                  <Input type="number" placeholder="Precio Base $" value={newRuta.precio_base || ''} onChange={e => setNewRuta({...newRuta, precio_base: parseFloat(e.target.value)})} className="bg-white" />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="w-full gap-2" onClick={handleCreateOrUpdateRuta}>
                    {isEditing ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />} 
                    {isEditing ? 'Actualizar' : 'Crear Ruta'}
                  </Button>
                  {isEditing && (
                    <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Lista de Rutas */}
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto text-slate-400" /> : rutas.map(ruta => (
                  <div 
                    key={ruta.id}
                    onClick={() => setSelectedRuta(ruta)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md group relative ${selectedRuta?.id === ruta.id ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-slate-200 bg-white'}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-slate-800">{ruta.origen} ➝ {ruta.destino}</h4>
                        <p className="text-xs text-slate-500 mt-1">{ruta.duracion} • ${ruta.precio_base}</p>
                      </div>
                      <Badge variant="outline" className="bg-white">{ruta.estado}</Badge>
                    </div>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleEditRuta(ruta); }}
                        className="p-1 hover:bg-blue-100 text-blue-500 rounded"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteRuta(ruta.id); }}
                        className="p-1 hover:bg-red-100 text-red-500 rounded"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Panel Derecho: Checkpoints */}
        <div className="lg:col-span-2">
          {selectedRuta ? (
            <Card className="border-slate-200 shadow-md h-full">
              <CardHeader className="border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Navigation className="w-5 h-5 text-primary" /> Checkpoints
                    </CardTitle>
                    <CardDescription>
                      Puntos de control para la ruta <span className="font-bold text-slate-800">{selectedRuta.origen} - {selectedRuta.destino}</span>
                    </CardDescription>
                  </div>
                  <Badge className="text-lg px-3 py-1">{checkpoints.length} Puntos</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                
                {/* Formulario Nuevo Checkpoint */}
                <div className="flex flex-col md:flex-row gap-4 items-end bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="space-y-2 flex-1">
                    <Label>Nombre del Checkpoint</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input 
                        placeholder="Ej: Peaje Machachi" 
                        className="pl-10 bg-white" 
                        value={newCheckpoint.nombre}
                        onChange={e => setNewCheckpoint({...newCheckpoint, nombre: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2 w-24">
                    <Label>Orden</Label>
                    <Input 
                      type="number" 
                      className="bg-white" 
                      value={newCheckpoint.orden}
                      onChange={e => setNewCheckpoint({...newCheckpoint, orden: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2 w-32">
                    <Label>Latitud</Label>
                    <Input type="number" placeholder="-0.00" className="bg-white" value={newCheckpoint.lat} onChange={e => setNewCheckpoint({...newCheckpoint, lat: parseFloat(e.target.value)})} />
                  </div>
                  <div className="space-y-2 w-32">
                    <Label>Longitud</Label>
                    <Input type="number" placeholder="-78.00" className="bg-white" value={newCheckpoint.lng} onChange={e => setNewCheckpoint({...newCheckpoint, lng: parseFloat(e.target.value)})} />
                  </div>
                  <Button onClick={handleCreateCheckpoint} className="gap-2 bg-slate-800 hover:bg-slate-700">
                    <Save className="w-4 h-4" /> Guardar
                  </Button>
                </div>

                {/* Lista Visual de Checkpoints */}
                <div className="relative pl-8 border-l-2 border-slate-200 space-y-8 py-4">
                  {loadingCheckpoints ? <Loader2 className="w-8 h-8 animate-spin text-primary" /> : checkpoints.map((cp, index) => (
                    <div key={cp.id} className="relative group">
                      <div className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-white border-4 border-primary flex items-center justify-center z-10"></div>
                      <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm flex justify-between items-center group-hover:border-primary/30 transition-colors">
                        <div>
                          <h5 className="font-bold text-slate-800 flex items-center gap-2">
                            <span className="text-slate-400 text-sm">#{cp.orden}</span> {cp.nombre}
                          </h5>
                          <p className="text-xs text-slate-400 font-mono mt-1">Lat: {cp.lat}, Lng: {cp.lng}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-500" onClick={() => handleDeleteCheckpoint(cp.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {checkpoints.length === 0 && <p className="text-slate-400 italic">No hay checkpoints registrados para esta ruta.</p>}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl p-12 bg-slate-50/50">
              <Map className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-lg font-medium">Selecciona una ruta para gestionar sus checkpoints</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default RouteManagement;