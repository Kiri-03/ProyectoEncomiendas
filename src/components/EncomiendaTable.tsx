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

const MOCK_DATA = [
  {
    id: "1",
    trackingCode: "001-000452",
    sender: "Juan Pérez",
    receiver: "María García",
    destination: "Trujillo",
    status: "pendiente" as const,
    date: "2024-03-20",
    total: 17.50
  },
  {
    id: "2",
    trackingCode: "001-000453",
    sender: "Carlos Ruiz",
    receiver: "Ana Torres",
    destination: "Arequipa",
    status: "en_camino" as const,
    date: "2024-03-19",
    total: 25.00
  },
  {
    id: "3",
    trackingCode: "001-000454",
    sender: "Roberto Lima",
    receiver: "Elena Paz",
    destination: "Cusco",
    status: "entregado" as const,
    date: "2024-03-18",
    total: 12.00
  }
];

const EncomiendaTable = () => {
  const navigate = useNavigate();

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/50">
            <TableHead className="font-bold">Código</TableHead>
            <TableHead className="font-bold">Remitente</TableHead>
            <TableHead className="font-bold">Destinatario</TableHead>
            <TableHead className="font-bold">Destino</TableHead>
            <TableHead className="font-bold">Estado</TableHead>
            <TableHead className="font-bold text-right">Total</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {MOCK_DATA.map((item) => (
            <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors">
              <TableCell className="font-mono font-medium text-primary">{item.trackingCode}</TableCell>
              <TableCell>{item.sender}</TableCell>
              <TableCell>{item.receiver}</TableCell>
              <TableCell>{item.destination}</TableCell>
              <TableCell>
                <StatusBadge status={item.status} />
              </TableCell>
              <TableCell className="text-right font-bold">${item.total.toFixed(2)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => navigate(`/guia/${item.id}`)}>
                      <Eye className="mr-2 h-4 w-4" /> Ver Guía
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Printer className="mr-2 h-4 w-4" /> Imprimir Ticket
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-blue-600">
                      <Truck className="mr-2 h-4 w-4" /> Actualizar Estado
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EncomiendaTable;