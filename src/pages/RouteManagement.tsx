import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Map, Search, MoreVertical, Plus, Edit, Trash2, X } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiClient } from '@/lib/api-client';

const RouteManagement = () => {
  const [routes, setRoutes] = useState<any[]>([]);
  const [filteredRoutes, setFilteredRoutes] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<any>({
    origen: '', destino: '', duracion: '', precio_base: 0, estado: 'activa'
  });

  const fetchRoutes = async () => {
    try {
      const data = await apiClient.tracking.getRutas();
      setRoutes(data);
      setFilteredRoutes(data);
    } catch (error) {
      showError("Error al cargar rutas");
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredRoutes(routes);
    } else {
      const lower = searchTerm.toLowerCase();
      setFilteredRoutes(routes.filter(r => 
        r.origen.toLowerCase().includes(lower) || 
        r.destino.toLowerCase().includes(lower)
      ));
    }
  }, [searchTerm, routes]);

  const toggleMenu = (id: string) => setActiveMenu(activeMenu === id ? null : id);

  const handleNewRoute = () => {
    setIsEditing(false);
    setCurrentRoute({ origen: '', destino: '', duracion: '', precio_base: 0, estado: 'activa' });
    setIsModalOpen(true);
  };

  const handleEditRoute = (route: any) => {
    setIsEditing(true);
    setCurrentRoute(route);
    setIsModalOpen(true);
    setActiveMenu(null);
  };

  const handleDeleteRoute = async (id: string) => {
    if(!confirm("¿Eliminar ruta?")) return;
    await apiClient.tracking.deleteRuta(id);
    showSuccess("Ruta eliminada");
    fetchRoutes();
    setActiveMenu(null);
  };

  const handleSave = async () => {
    try {
      if (isEditing) {
        await apiClient.tracking.updateRuta(currentRoute.id, currentRoute);
      } else {
        await apiClient.tracking.createRuta(currentRoute);
      }
      showSuccess("Ruta guardada correctamente");
      setIsModalOpen(false);
      fetchRoutes();
    } catch (e) { showError("Error al guardar ruta"); }
  };

  return (
    <Layout role="administrador">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Gestión de Rutas</h2>
          <p className="text-slate-500">Configuración de trayectos y tiempos estimados.</p>
        </div>
        <Button className="gap-2" onClick={handleNewRoute}>
          <Plus className="w-4 h-4" /> Nueva Ruta
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Buscar por origen o destino..." 
              className="pl-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50">
              <TableHead className="font-bold">Origen</TableHead>
              <TableHead className="font-bold">Destino</TableHead>
              <TableHead className="font-bold">Duración Est.</TableHead>
              <TableHead className="font-bold">Precio Base</TableHead>
              <TableHead className="font-bold">Estado</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRoutes.map((route) => (
              <TableRow key={route.id}>
                <TableCell className="font-medium">{route.origen}</TableCell>
                <TableCell className="font-medium">{route.destino}</TableCell>
                <TableCell>{route.duracion}</TableCell>
                <TableCell>${route.precio_base.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant={route.estado === 'activa' ? 'default' : 'secondary'} className={route.estado === 'activa' ? 'bg-emerald-100 text-emerald-700' : ''}>
                    {route.estado}
                  </Badge>
                </TableCell>
                <TableCell className="relative">
                  <Button variant="ghost" size="icon" onClick={() => toggleMenu(route.id)}><MoreVertical className="w-4 h-4" /></Button>
                  {activeMenu === route.id && (
                    <div className="absolute right-8 top-0 w-48 bg-white rounded-lg shadow-xl border border-slate-100 z-10 py-1 animate-in fade-in zoom-in-95 duration-200">
                      <button onClick={() => handleEditRoute(route)} className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2"><Edit className="w-4 h-4" /> Editar Ruta</button>
                      <div className="h-px bg-slate-100 my-1"></div>
                      <button onClick={() => handleDeleteRoute(route.id)} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"><Trash2 className="w-4 h-4" /> Eliminar</button>
                    </div>
                  )}
                  {activeMenu === route.id && <div className="fixed inset-0 z-0" onClick={() => setActiveMenu(null)}></div>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal Ruta */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{isEditing ? 'Editar Ruta' : 'Nueva Ruta'}</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-slate-500" /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Origen</Label>
                  <Input value={currentRoute.origen} onChange={e => setCurrentRoute({...currentRoute, origen: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Destino</Label>
                  <Input value={currentRoute.destino} onChange={e => setCurrentRoute({...currentRoute, destino: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Duración Estimada</Label>
                <Input value={currentRoute.duracion} onChange={e => setCurrentRoute({...currentRoute, duracion: e.target.value})} placeholder="Ej: 8h 30m" />
              </div>
              <div className="space-y-2">
                <Label>Precio Base ($)</Label>
                <Input type="number" value={currentRoute.precio_base} onChange={e => setCurrentRoute({...currentRoute, precio_base: parseFloat(e.target.value)})} />
              </div>
              <div className="space-y-2">
                <Label>Estado</Label>
                <Select value={currentRoute.estado} onValueChange={v => setCurrentRoute({...currentRoute, estado: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="activa">Activa</SelectItem><SelectItem value="mantenimiento">Mantenimiento</SelectItem></SelectContent>
                </Select>
              </div>
              <Button className="w-full mt-4" onClick={handleSave}>Guardar Ruta</Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default RouteManagement;