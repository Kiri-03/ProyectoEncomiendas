"use client";

import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter, Download, Loader2 } from 'lucide-react';
import EncomiendaTable from '@/components/EncomiendaTable';
import { Link } from 'react-router-dom';
import { apiClient } from '@/lib/api-client';
import { showError } from '@/utils/toast';

const EncomiendaManagement = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const encomiendas = await apiClient.encomiendas.getAll();
      setData(encomiendas);
    } catch (err) {
      showError("Error al cargar el listado de encomiendas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Layout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Gestión de Encomiendas</h2>
          <p className="text-slate-500">Administra, filtra y genera nuevas guías de remisión.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" className="gap-2 flex-1 md:flex-none">
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
          <Input placeholder="Buscar por código, remitente o destino..." className="pl-10" />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" /> Filtros Avanzados
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <EncomiendaTable data={data} onRefresh={fetchData} />
      )}
    </Layout>
  );
};

export default EncomiendaManagement;