import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Truck, Users, LayoutDashboard, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Layout = ({ children, role = 'empleado' }: { children: React.ReactNode, role?: string }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <Truck className="w-8 h-8" />
            TransLog
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <Link to="/dashboard">
            <Button variant="ghost" className="w-full justify-start gap-3">
              <LayoutDashboard className="w-5 h-5" /> Dashboard
            </Button>
          </Link>
          
          <Link to="/encomiendas/nueva">
            <Button variant="ghost" className="w-full justify-start gap-3">
              <Package className="w-5 h-5" /> Nueva Encomienda
            </Button>
          </Link>

          {role === 'admin' && (
            <Link to="/usuarios">
              <Button variant="ghost" className="w-full justify-start gap-3">
                <Users className="w-5 h-5" /> Usuarios
              </Button>
            </Link>
          )}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <Button 
            variant="outline" 
            className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={() => navigate('/')}
          >
            <LogOut className="w-5 h-5" /> Cerrar Sesión
          </Button>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;