"use client";

import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, MoreHorizontal, Printer, Truck } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import StatusBadge from './StatusBadge';
import { useNavigate } from 'react-router-dom';
import { showSuccess, showError } from '@/utils/toast';
import { apiClient } from '@/lib/api-client';

interface EncomiendaTableProps {
  data?: any[]; // Hecho opcional
  onRefresh?: () => void;
}

const EncomiendaTable = ({ data = [], onRefresh }: EncomiendaTableProps) => {
  const navigate = useNavigate();

  const handleAction = async (action: string, id: string) => {
    try {
      if (action === 'view') {
        navigate(`/guia/${id}`);
      }
      if (action === 'print') showSuccess("Generando ticket de impresión...");
      if (action === 'status') {
        await apiClient.encomiendas.updateStatus(id, 'en_transito');
        showSuccess("Estado actualizado a En Tránsito");
        onRefresh?.();
      }
    } catch (err) {
      showError("No tienes permiso para realizar esta acción.");
    }
  };

  return (
    <div className="rounded-xl border bg-white overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50">
              <TableHead className="font-bold">Código</TableHead>
              <TableHead className="font-bold">Remitente</TableHead>
              <TableHead className="font-bold">Destinatario</TableHead>
              <TableHead className="font-bold">Estado</TableHead>
              <TableHead className="font-bold text-right">Total</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!data || data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-slate-400">
                  No se encontraron encomiendas registradas.
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell className="font-mono font-medium text-primary">{item.tracking_code}</TableCell>
                  <TableCell className="whitespace-nowrap">{item.sender_name || 'N/A'}</TableCell>
                  <TableCell className="whitespace-nowrap">{item.receiver_name}</TableCell>
                  <TableCell>
                    <StatusBadge status={item.status} />
                  </TableCell>
                  <TableCell className="text-right font-bold">${item.subtotal?.toFixed(2)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleAction('view', item.id)}>
                          <Eye className="mr-2 h-4 w-4" /> Ver Guía
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction('print', item.id)}>
                          <Printer className="mr-2 h-4 w-4" /> Imprimir Ticket
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-blue-600" onClick={() => handleAction('status', item.id)}>
                          <Truck className="mr-2 h-4 w-4" /> Despachar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default EncomiendaTable;