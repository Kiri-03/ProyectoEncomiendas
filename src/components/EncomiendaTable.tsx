import React, { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MoreVertical, FileText, Printer, Eye, Download, Filter, X 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { showSuccess } from '@/utils/toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EncomiendaTableProps {
  data: any[];
}

const EncomiendaTable = ({ data }: EncomiendaTableProps) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const toggleMenu = (id: string) => setActiveMenu(activeMenu === id ? null : id);

  const handleExport = () => {
    // Lógica simple de exportación a CSV
    const headers = ["Tracking", "Remitente", "Destinatario", "Estado", "Fecha"];
    const csvContent = [
      headers.join(","),
      ...data.map(row => [
        row.tracking_code, 
        `"${row.remitente_nombre}"`, 
        `"${row.destinatario_nombre}"`, 
        row.status, 
        row.created_at
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "encomiendas_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showSuccess("Datos exportados correctamente");
  };

  const handlePrint = (trackingCode: string) => {
    // Simulación de impresión
    showSuccess(`Imprimiendo ticket para ${trackingCode}...`);
    // En un caso real, abriría una ventana nueva con el diseño del ticket y window.print()
  };

  const filteredData = statusFilter === 'all' 
    ? data 
    : data.filter(item => item.status === statusFilter);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] h-8 bg-white">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="en_bodega_origen">En Bodega</SelectItem>
              <SelectItem value="en_transito">En Tránsito</SelectItem>
              <SelectItem value="entregado">Entregado</SelectItem>
            </SelectContent>
          </Select>
          {statusFilter !== 'all' && (
            <Button variant="ghost" size="sm" onClick={() => setStatusFilter('all')} className="h-8 px-2 text-slate-500">
              <X className="w-3 h-3 mr-1" /> Limpiar
            </Button>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
          <Download className="w-4 h-4" /> Exportar CSV
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Remitente</TableHead>
            <TableHead>Destinatario</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.length > 0 ? filteredData.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-mono font-medium text-slate-700">{item.tracking_code}</TableCell>
              <TableCell>{item.remitente_nombre}</TableCell>
              <TableCell>{item.destinatario_nombre}</TableCell>
              <TableCell>
                <Badge variant="outline" className={`
                  ${item.status === 'entregado' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ''}
                  ${item.status === 'en_transito' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                  ${item.status === 'en_bodega_origen' ? 'bg-amber-50 text-amber-700 border-amber-200' : ''}
                `}>
                  {item.status.replace(/_/g, ' ')}
                </Badge>
              </TableCell>
              <TableCell className="text-slate-500 text-sm">
                {new Date(item.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="relative">
                <Button variant="ghost" size="icon" onClick={() => toggleMenu(item.id)}><MoreVertical className="w-4 h-4" /></Button>
                {activeMenu === item.id && (
                  <div className="absolute right-8 top-0 w-48 bg-white rounded-lg shadow-xl border border-slate-100 z-10 py-1 animate-in fade-in zoom-in-95 duration-200">
                    <Link to={`/tracking/${item.tracking_code}`} className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                      <Eye className="w-4 h-4" /> Ver Guía / Rastreo
                    </Link>
                    <button onClick={() => handlePrint(item.tracking_code)} className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                      <Printer className="w-4 h-4" /> Imprimir Ticket
                    </button>
                  </div>
                )}
                {activeMenu === item.id && <div className="fixed inset-0 z-0" onClick={() => setActiveMenu(null)}></div>}
              </TableCell>
            </TableRow>
          )) : (
            <TableRow><TableCell colSpan={6} className="text-center py-8 text-slate-500">No se encontraron encomiendas</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default EncomiendaTable;