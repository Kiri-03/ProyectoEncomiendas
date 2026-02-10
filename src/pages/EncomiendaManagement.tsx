"use client";

import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter, Download, Loader2, Eye, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { apiClient } from '@/lib/api-client';
import { showError, showSuccess } from '@/utils/toast';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const EncomiendaManagement = () => {
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const fetchData = async () => {
    setLoading(true);
    try {
      const encomiendas = await apiClient.encomiendas.getAll();
      setData(encomiendas);
      setFilteredData(encomiendas);
    } catch (err) {
      showError("Error al cargar el listado de encomiendas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let result = data;

    // 1. Filtro por Texto
    if (searchTerm.trim() !== '') {
      const lower = searchTerm.toLowerCase();
      result = result.filter(item => 
        item.tracking_code.toLowerCase().includes(lower) ||
        item.remitente_nombre.toLowerCase().includes(lower) ||
        item.destinatario_nombre.toLowerCase().includes(lower)
      );
    }

    // 2. Filtro por Estado
    if (statusFilter !== 'all') {
      result = result.filter(item => item.status === statusFilter);
    }

    // 3. Filtro por Fecha
    if (dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      result = result.filter(item => {
        if (!item.created_at) return false;
        const itemDate = new Date(item.created_at);
        const itemDay = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate());
        
        if (dateFilter === 'today') return itemDay.getTime() === today.getTime();
        if (dateFilter === 'week') {
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          return itemDay >= weekAgo;
        }
        return true;
      });
    }

    setFilteredData(result);
  }, [searchTerm, data, statusFilter, dateFilter]);

  const handleExport = () => {
    if (filteredData.length === 0) {
      showError("No hay datos para exportar");
      return;
    }

    const headers = ["Tracking", "Remitente", "Destinatario", "Destino", "Estado", "Fecha", "Subtotal"];
    const csvContent = [
      headers.join(","),
      ...filteredData.map(row => [
        row.tracking_code,
        `"${(row.remitente_nombre || '').replace(/"/g, '""')}"`,
        `"${(row.destinatario_nombre || '').replace(/"/g, '""')}"`,
        `"${(row.destino_direccion || '').replace(/"/g, '""')}"`,
        row.status,
        row.created_at ? new Date(row.created_at).toLocaleDateString() : '',
        (row.subtotal || 0).toFixed(2)
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `encomiendas_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showSuccess("Reporte descargado exitosamente");
  };

  return (
    <Layout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Gestión de Encomiendas</h2>
          <p className="text-slate-500">Administra, filtra y genera nuevas guías de remisión.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" className="gap-2 flex-1 md:flex-none" onClick={handleExport}>
            <Download className="w-4 h-4" /> Exportar
          </Button>
          <Link to="/encomiendas/nueva" className="flex-1 md:flex-none">
            <Button className="gap-2 w-full shadow-lg shadow-primary/20">
              <Plus className="w-4 h-4" /> Nueva Encomienda
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border shadow-sm mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Buscar por código, remitente o destino..." 
            className="pl-10" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button 
          variant={showFilters ? "secondary" : "outline"} 
          className="gap-2" 
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="w-4 h-4" /> Filtros Avanzados
        </Button>
      </div>

      {showFilters && (
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Estado del Envío</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-white"><SelectValue placeholder="Todos" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="en_bodega_origen">En Bodega</SelectItem>
                <SelectItem value="en_transito">En Tránsito</SelectItem>
                <SelectItem value="entregado">Entregado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Fecha de Registro</label>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="bg-white"><SelectValue placeholder="Todas" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Cualquier fecha</SelectItem>
                <SelectItem value="today">Hoy</SelectItem>
                <SelectItem value="week">Última Semana</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead>Tracking</TableHead>
                <TableHead>Remitente</TableHead>
                <TableHead>Destino</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-bold font-mono">{item.tracking_code}</TableCell>
                  <TableCell>{item.remitente_nombre}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {item.destino_direccion}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {item.status.replace(/_/g, ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => navigate(`/guia/${item.tracking_code}`)}
                      className="hover:text-primary"
                    >
                      <Eye className="w-4 h-4 mr-2" /> Ver Guía
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                    No se encontraron encomiendas.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </Layout>
  );
};

export default EncomiendaManagement;