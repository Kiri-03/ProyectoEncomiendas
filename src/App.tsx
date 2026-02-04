import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AuthGuard from "./components/AuthGuard";
import RoleGuard from "./components/RoleGuard";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import UserManagement from "./pages/UserManagement";
import EncomiendaManagement from "./pages/EncomiendaManagement";
import CreateEncomienda from "./pages/CreateEncomienda";
import GuideView from "./pages/GuideView";
import Tracking from "./pages/Tracking";
import RouteManagement from "./pages/RouteManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/rastreo" element={<Tracking />} />

            <Route path="/dashboard" element={<AuthGuard><Dashboard /></AuthGuard>} />
            <Route path="/encomiendas" element={<AuthGuard><EncomiendaManagement /></AuthGuard>} />
            <Route path="/encomiendas/nueva" element={<AuthGuard><CreateEncomienda /></AuthGuard>} />
            <Route path="/guia/:id" element={<AuthGuard><GuideView /></AuthGuard>} />

            <Route path="/admin" element={<AuthGuard><RoleGuard allowedRoles={['administrador']}><AdminDashboard /></RoleGuard></AuthGuard>} />
            <Route path="/usuarios" element={<AuthGuard><RoleGuard allowedRoles={['administrador']}><UserManagement /></RoleGuard></AuthGuard>} />
            <Route path="/rutas" element={<AuthGuard><RoleGuard allowedRoles={['administrador']}><RouteManagement /></RoleGuard></AuthGuard>} />

            <Route path="/unauthorized" element={<div className="p-20 text-center">No tienes permiso para ver esta página.</div>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;