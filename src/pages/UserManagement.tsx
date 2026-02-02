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
import { UserPlus, Search, MoreVertical, ShieldCheck } from 'lucide-react';

const MOCK_USERS = [
  { id: 1, name: "Carlos Rodríguez", role: "conductor", office: "Lima - Central", status: "activo" },
  { id: 2, name: "Ana Martínez", role: "empleado", office: "Trujillo - Norte", status: "activo" },
  { id: 3, name: "Roberto Gómez", role: "admin", office: "Lima - Central", status: "activo" },
  { id: 4, name: "Lucía Pardo", role: "empleado", office: "Arequipa - Sur", status: "inactivo" },
];

const UserManagement = () => {
  return (
    <Layout role="admin">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Gestión de Usuarios</h2>
          <p className="text-slate-500">Administra el personal, roles y accesos al sistema.</p>
        </div>
        <Button className="gap-2">
          <UserPlus className="w-4 h-4" /> Nuevo Usuario
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Buscar por nombre, rol u oficina..." className="pl-10" />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50">
              <TableHead className="font-bold">Usuario</TableHead>
              <TableHead className="font-bold">Rol</TableHead>
              <TableHead className="font-bold">Oficina</TableHead>
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
                      {user.name.charAt(0)}
                    </div>
                    {user.name}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 capitalize">
                    {user.role === 'admin' && <ShieldCheck className="w-4 h-4 text-primary" />}
                    {user.role}
                  </div>
                </TableCell>
                <TableCell className="text-slate-500">{user.office}</TableCell>
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