import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer, Mail, Download, QrCode } from 'lucide-react';

const GuideView = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Guía de Remisión Electrónica</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Printer className="w-4 h-4 mr-2" /> Imprimir</Button>
          <Button variant="outline" size="sm"><Mail className="w-4 h-4 mr-2" /> Enviar Correo</Button>
          <Button size="sm"><Download className="w-4 h-4 mr-2" /> Descargar PDF</Button>
        </div>
      </div>

      <Card className="border-2 border-slate-200 shadow-none">
        <CardHeader className="border-b bg-slate-50">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-primary text-3xl font-black italic">TRANSLOG S.A.C</CardTitle>
              <p className="text-sm text-slate-500">RUC: 20123456789</p>
            </div>
            <div className="text-right border-2 border-primary p-4 rounded-lg">
              <p className="text-xs font-bold text-primary">GUÍA DE REMISIÓN</p>
              <p className="text-xl font-mono font-bold">001 - No. 000452</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold text-slate-400 uppercase text-xs mb-2">Remitente</h4>
              <p className="font-semibold">Juan Pérez Rodríguez</p>
              <p className="text-sm text-slate-600">DNI: 45678912</p>
            </div>
            <div>
              <h4 className="font-bold text-slate-400 uppercase text-xs mb-2">Destinatario</h4>
              <p className="font-semibold">María García López</p>
              <p className="text-sm text-slate-600">Telf: 987 654 321</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold text-slate-400 uppercase text-xs mb-2">Punto de Partida</h4>
              <p className="text-sm">Oficina Central - Av. La Marina 123, Lima</p>
            </div>
            <div>
              <h4 className="font-bold text-slate-400 uppercase text-xs mb-2">Punto de Llegada</h4>
              <p className="text-sm">Sede Norte - Calle Real 456, Trujillo</p>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-4 py-2 text-left">Cant.</th>
                  <th className="px-4 py-2 text-left">Descripción</th>
                  <th className="px-4 py-2 text-right">Peso</th>
                  <th className="px-4 py-2 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-2">01</td>
                  <td className="px-4 py-2">Caja de repuestos electrónicos</td>
                  <td className="px-4 py-2 text-right">5.00 kg</td>
                  <td className="px-4 py-2 text-right">$17.50</td>
                </tr>
              </tbody>
              <tfoot className="bg-slate-50 font-bold">
                <tr>
                  <td colSpan={3} className="px-4 py-2 text-right">TOTAL A PAGAR</td>
                  <td className="px-4 py-2 text-right text-primary text-lg">$17.50</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="flex justify-between items-end pt-8">
            <div className="text-center">
              <QrCode className="w-24 h-24 mx-auto mb-2 opacity-50" />
              <p className="text-[10px] text-slate-400">Representación impresa de la Guía Electrónica</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">Transportista: Carlos Rodríguez</p>
              <p className="text-xs text-slate-500">Vehículo: BUS-782 (ABC-123)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuideView;