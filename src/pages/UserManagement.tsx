"use client";

import React from 'react';
import Layout from '@/components/Layout';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Search, MoreVertical, ShieldCheck, Phone } from 'lucide-react';

const MOCK_USERS = [
  { id: 1, nombre: "Carlos", apellido: "Rodríguez", rol: "conductor", telefono: "987654321", status: "activo" },
  { id: 2, nombre: "Ana", apellido: "Martínez", rol: "empleado", telefono: "912345678", status: "activo" },
  { id: 3, nombre: "Roberto", apellido: "Gómez", rol: "administrador", telefono: "955443322", status: "activo" },
  { id: 4, nombre: "Lucía", apellido: "Pardo", rol: "empleado", telefono: "900112233", status: "inactivo" },
];

const UserManagement = () => {
  return (
    <Layout role="administrador">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Gestión de Usuarios</h2>
          <p className="text-slate-500">Administra el personal, roles y accesos sincronizados con el servicio de Auth.</p>
        </div>
        <Button className="gap-2">
          <UserPlus className="w-4 h-4" /> Nuevo Usuario
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Buscar por nombre, rol o teléfono..." className="pl-10" />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50">
              <TableHead className="font-bold">Usuario</TableHead>
              <TableHead className="font-bold">Rol</TableHead>
              <TableHead className="font-bold">Teléfono</TableHead>
              <TableHead className="font-bold">Estado</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_USERS.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">
                      {user.nombre.charAt(0)}
                    </div>
                    <div>
                      <p>{user.nombre} {user.apellido}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 capitalize">
                    {user.rol === 'administrador' && <ShieldCheck className="w-4 h-4 text-primary" />}
                    {user.rol}
                  </div>
                </TableCell>
                <TableCell className="text-slate-500">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3 h-3" />
                    {user.telefono}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={user.status === 'activo' ? 'default' : 'secondary'} className={user.status === 'activo' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : ''}>
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Layout>
  );
};

export default UserManagement;