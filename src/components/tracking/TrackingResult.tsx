import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, ArrowRight, Bus, CheckCircle2, Package } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import { cn } from '@/lib/utils';

interface TrackingResultProps {
  result: any;
}

const TrackingResult = ({ result }: TrackingResultProps) => {
  if (!result) return null;

  return (
    <Card className="border-none shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardHeader className="bg-primary text-white p-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-primary-foreground/70 text-xs font-bold uppercase tracking-wider">Guía de Remisión</p>
            <CardTitle className="text-2xl font-mono">{result.tracking_code}</CardTitle>
          </div>
          <StatusBadge status={result.status} className="bg-white/20 border-white/30 text-white" />
        </div>
      </CardHeader>
      <CardContent className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-slate-100 rounded-lg"><MapPin className="w-5 h-5 text-slate-600" /></div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Ubicación Actual</p>
              <p className="font-bold text-slate-800">{result.location || 'No disponible'}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-slate-100 rounded-lg"><ArrowRight className="w-5 h-5 text-slate-600" /></div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Último Evento</p>
              <p className="font-bold text-slate-800">{result.message}</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bus className="text-blue-600 w-6 h-6" />
            <div>
              <p className="text-[10px] font-bold text-blue-400 uppercase">Estado del Envío</p>
              <p className="font-bold text-blue-900 capitalize">{result.status.replace('_', ' ')}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-blue-400 uppercase">Fecha Actualización</p>
            <p className="text-xs font-medium text-blue-800">
              {new Date(result.timestamp).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Historial simplificado basado en el último evento */}
        <div className="relative space-y-6">
          <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-slate-100"></div>
          <div className="flex items-start gap-4 relative z-10">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm bg-emerald-500 text-white"
            )}>
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="flex-1 pt-1">
              <p className="font-bold text-slate-900">{result.message}</p>
              <p className="text-xs text-slate-500">{new Date(result.timestamp).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrackingResult;