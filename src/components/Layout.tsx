"use client";

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Package, 
  Truck, 
  Users, 
  LayoutDashboard, 
  LogOut, 
  ShieldCheck, 
  Menu, 
  Map
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const NavItems = () => (
    <div className="space-y-2">
      {user?.rol === 'administrador' ? (
        <>
          <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)}>
            <Button variant="ghost" className={cn("w-full justify-start gap-3", isActive('/admin') && "bg-primary/10 text-primary font-bold")}>
              <ShieldCheck className="w-5 h-5" /> Admin Panel
            </Button>
          </Link>
          <Link to="/usuarios" onClick={() => setIsMobileMenuOpen(false)}>
            <Button variant="ghost" className={cn("w-full justify-start gap-3", isActive('/usuarios') && "bg-primary/10 text-primary font-bold")}>
              <Users className="w-5 h-5" /> Usuarios
            </Button>
          </Link>
          <Link to="/rutas" onClick={() => setIsMobileMenuOpen(false)}>
            <Button variant="ghost" className={cn("w-full justify-start gap-3", isActive('/rutas') && "bg-primary/10 text-primary font-bold")}>
              <Map className="w-5 h-5" /> Rutas
            </Button>
          </Link>
        </>
      ) : (
        <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
          <Button variant="ghost" className={cn("w-full justify-start gap-3", isActive('/dashboard') && "bg-primary/10 text-primary font-bold")}>
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Button>
        </Link>
      )}
      
      <Link to="/encomiendas" onClick={() => setIsMobileMenuOpen(false)}>
        <Button variant="ghost" className={cn("w-full justify-start gap-3", isActive('/encomiendas') && "bg-primary/10 text-primary font-bold")}>
          <Package className="w-5 h-5" /> Gestión Encomiendas
        </Button>
      </Link>
    </div>
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <header className="md:hidden bg-white border-b p-4 flex items-center justify-between sticky top-0 z-50">
        <h1 className="text-xl font-black italic text-primary flex items-center gap-2">
          <Truck className="w-6 h-6" /> TransLog
        </h1>
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <div className="p-6 border-b">
              <h1 className="text-2xl font-black italic text-primary flex items-center gap-2">
                <Truck className="w-8 h-8" /> TransLog
              </h1>
            </div>
            <div className="p-4 flex-1">
              <NavItems />
            </div>
            <div className="p-4 border-t mt-auto">
              <Button variant="outline" className="w-full text-red-500" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" /> Salir
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </header>

      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 flex-col fixed h-full">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <Truck className="w-8 h-8" />
            TransLog
          </h1>
        </div>
        <nav className="flex-1 px-4">
          <NavItems />
        </nav>
        <div className="p-4 border-t border-slate-100">
          <div className="mb-4 px-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sesión como</p>
            <p className="text-sm font-bold text-slate-700 capitalize">{user?.rol}</p>
          </div>
          <Button variant="outline" className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleLogout}>
            <LogOut className="w-5 h-5" /> Cerrar Sesión
          </Button>
        </div>
      </aside>

      <main className="flex-1 md:ml-64 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;