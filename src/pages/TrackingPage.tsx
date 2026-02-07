import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Package, Truck, CheckCircle } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { apiClient } from '@/lib/api-client';

const TrackingPage = () => {
  const { trackingCode } = useParams();
  const [info, setInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTracking = async () => {
      try {
        // Obtener info básica de la encomienda
        const data = await apiClient.encomiendas.getByTracking(trackingCode || '');
        setInfo(data);
      } catch (error) {
        showError("No se encontró información para este código.");
      } finally {
        setLoading(false);
      }
    };
    fetchTracking();
  }, [trackingCode]);

  if (loading) return <Layout><div className="p-10 text-center">Cargando rastreo...</div></Layout>;
  if (!info) return <Layout><div className="p-10 text-center">Guía no encontrada.</div></Layout>;

  return (
    <Layout>
      <div className="mb-6">
        <Link to="/dashboard">
          <Button variant="ghost" className="gap-2 pl-0 hover:bg-transparent hover:text-primary">
            <ArrowLeft className="w-4 h-4" /> Volver al Dashboard
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border-none shadow-lg">
          <CardHeader className="bg-slate-50/50 border-b">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-slate-500">Código de Rastreo</p>
                <h2 className="text-3xl font-bold text-slate-800 tracking-tight">{info.tracking_code}</h2>
              </div>
              <Badge className="text-lg px-4 py-1 capitalize">{info.status.replace(/_/g, ' ')}</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-8 relative before:absolute before:left-4 before:top-2 before:h-full before:w-0.5 before:bg-slate-200">
              {/* Evento Actual Simulado */}
              <div className="relative pl-12">
                <div className="absolute left-0 top-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/30">
                  <Truck className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-lg text-slate-800">Estado Actual: {info.status.replace(/_/g, ' ')}</h4>
                <p className="text-slate-500">Última actualización: {new Date(info.created_at).toLocaleString()}</p>
                <p className="mt-2 text-slate-600">El paquete se encuentra en proceso logístico normal.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default TrackingPage;