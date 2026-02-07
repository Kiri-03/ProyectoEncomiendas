"use client";

import React, { useEffect, useState } from 'react';
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
import { UserPlus, Search, MoreVertical, ShieldCheck, Phone, Loader2, Edit, Trash2, Key, X } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { showError, showSuccess } from '@/utils/toast';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const UserManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  
  // Estados para Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>({
    email: '', password: '', nombre: '', apellido: '', rol: 'empleado', telefono: '', is_superuser: false
  });

  const fetchUsers = async () => {
    try {
      const data = await apiClient.auth.getUsers();
      const usersList = Array.isArray(data) ? data : (data.items || []);
      setUsers(usersList);
      setFilteredUsers(usersList);
    } catch (err) {
      showError("Error al cargar usuarios.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const lower = searchTerm.toLowerCase();
      setFilteredUsers(users.filter(u => 
        (u.nombre && u.nombre.toLowerCase().includes(lower)) ||
        (u.email && u.email.toLowerCase().includes(lower)) ||
        (u.rol && u.rol.toLowerCase().includes(lower))
      ));
    }
  }, [searchTerm, users]);

  const handleNewUser = () => {
    setIsEditing(false);
    setCurrentUser({ email: '', password: '', nombre: '', apellido: '', rol: 'empleado', telefono: '', is_superuser: false });
    setIsModalOpen(true);
  };

  const handleEditUser = (user: any) => {
    setIsEditing(true);
    setCurrentUser({ ...user, password: '' }); // No cargamos password
    setIsModalOpen(true);
    setActiveMenu(null);
  };

  const handleDeleteUser = async (id: string) => {
    if(!confirm("¿Está seguro de eliminar este usuario?")) return;
    try {
      await apiClient.auth.deleteUser(id);
      showSuccess("Usuario eliminado");
      fetchUsers();
    } catch(e) { showError("Error al eliminar"); }
    setActiveMenu(null);
  };

  const handleSave = async () => {
    try {
      // Preparar payload
      const payload: any = {
        email: currentUser.email,
        nombre: currentUser.nombre,
        apellido: currentUser.apellido,
        rol: currentUser.rol,
        telefono: currentUser.telefono,
        is_superuser: currentUser.rol === 'administrador',
        is_active: true,
        is_verified: true
      };

      if (!isEditing) payload.password = currentUser.password;
      
      if (isEditing) {
        await apiClient.auth.updateUser(currentUser.id, payload);
      } else {
        await apiClient.auth.register(payload);
      }
      
      showSuccess(isEditing ? "Usuario actualizado" : "Usuario creado");
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      showError("Error al guardar usuario. Verifique los datos.");
    }
  };

  const toggleMenu = (id: string) => setActiveMenu(activeMenu === id ? null : id);

  return (
    <Layout role="administrador">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Gestión de Usuarios</h2>
          <p className="text-slate-500">Administra el personal, roles y accesos sincronizados con el servicio de Auth.</p>
        </div>
        <Button className="gap-2" onClick={handleNewUser}>
          <UserPlus className="w-4 h-4" /> Nuevo Usuario
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Buscar por nombre, rol o teléfono..." 
              className="pl-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : (
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
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">
                      {(user.email || user.nombre || "U").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p>{user.nombre ? `${user.nombre} ${user.apellido || ''}` : user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 capitalize">
                    {(user.is_superuser || user.rol === 'administrador') && <ShieldCheck className="w-4 h-4 text-primary" />}
                    {user.rol || (user.is_superuser ? 'Administrador' : 'Usuario')}
                  </div>
                </TableCell>
                <TableCell className="text-slate-500">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3 h-3" />
                    {user.telefono || 'N/A'}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={user.is_active ? 'default' : 'secondary'} className={user.is_active ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : ''}>
                    {user.is_active ? 'Activo' : 'Inactivo'}
                  </Badge>
                </TableCell>
                <TableCell className="relative">
                  <Button variant="ghost" size="icon" onClick={() => toggleMenu(user.id)}><MoreVertical className="w-4 h-4" /></Button>
                  {activeMenu === user.id && (
                    <div className="absolute right-8 top-0 w-48 bg-white rounded-lg shadow-xl border border-slate-100 z-10 py-1 animate-in fade-in zoom-in-95 duration-200">
                      <button onClick={() => handleEditUser(user)} className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2"><Edit className="w-4 h-4" /> Editar Datos</button>
                      <button className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2"><Key className="w-4 h-4" /> Resetear Clave</button>
                      <div className="h-px bg-slate-100 my-1"></div>
                      <button onClick={() => handleDeleteUser(user.id)} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"><Trash2 className="w-4 h-4" /> Eliminar</button>
                    </div>
                  )}
                  {activeMenu === user.id && <div className="fixed inset-0 z-0" onClick={() => setActiveMenu(null)}></div>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        )}
      </div>

      {/* Modal de Usuario */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-slate-500" /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombre</Label>
                  <Input value={currentUser.nombre} onChange={e => setCurrentUser({...currentUser, nombre: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Apellido</Label>
                  <Input value={currentUser.apellido} onChange={e => setCurrentUser({...currentUser, apellido: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={currentUser.email} onChange={e => setCurrentUser({...currentUser, email: e.target.value})} disabled={isEditing} />
              </div>
              {!isEditing && (
                <div className="space-y-2">
                  <Label>Contraseña</Label>
                  <Input type="password" value={currentUser.password} onChange={e => setCurrentUser({...currentUser, password: e.target.value})} />
                </div>
              )}
              <div className="space-y-2">
                <Label>Rol</Label>
                <Select value={currentUser.rol} onValueChange={v => setCurrentUser({...currentUser, rol: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="empleado">Empleado</SelectItem>
                    <SelectItem value="administrador">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Teléfono</Label>
                <Input value={currentUser.telefono} onChange={e => setCurrentUser({...currentUser, telefono: e.target.value})} />
              </div>
              <Button className="w-full mt-4" onClick={handleSave}>Guardar Usuario</Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default UserManagement;