import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer, Mail, Download, QrCode, Bus } from 'lucide-react';

const GuideView = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Guía de Remisión de Encomienda</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Printer className="w-4 h-4 mr-2" /> Imprimir</Button>
          <Button variant="outline" size="sm"><Mail className="w-4 h-4 mr-2" /> Enviar</Button>
          <Button size="sm"><Download className="w-4 h-4 mr-2" /> PDF</Button>
        </div>
      </div>

      <Card className="border-2 border-slate-200 shadow-none">
        <CardHeader className="border-b bg-slate-50">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-primary text-3xl font-black italic">COOPERATIVA TRANSLOG</CardTitle>
              <p className="text-sm text-slate-500">RUC: 1791234567001</p>
              <p className="text-xs text-slate-400">Matriz: Terminal Terrestre Quitumbe, Quito</p>
            </div>
            <div className="text-right border-2 border-primary p-4 rounded-lg bg-white">
              <p className="text-xs font-bold text-primary">GUÍA DE REMISIÓN</p>
              <p className="text-xl font-mono font-bold">001 - No. 000452</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          <div className="grid grid-cols-3 gap-8">
            <div>
              <h4 className="font-bold text-slate-400 uppercase text-[10px] mb-2">Remitente</h4>
              <p className="font-semibold">Juan Pérez Rodríguez</p>
              <p className="text-sm text-slate-600">CI: 1712345678</p>
            </div>
            <div>
              <h4 className="font-bold text-slate-400 uppercase text-[10px] mb-2">Destinatario</h4>
              <p className="font-semibold">María García López</p>
              <p className="text-sm text-slate-600">Telf: 098 765 4321</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <h4 className="font-bold text-primary uppercase text-[10px] mb-2 flex items-center gap-1">
                <Bus className="w-3 h-3" /> Transporte Asignado
              </h4>
              <p className="font-bold text-lg">DISCO 045</p>
              <p className="text-xs text-slate-500">Placa: ABC-1234</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold text-slate-400 uppercase text-[10px] mb-2">Terminal Origen</h4>
              <p className="text-sm font-medium">Terminal Quitumbe (Quito)</p>
            </div>
            <div>
              <h4 className="font-bold text-slate-400 uppercase text-[10px] mb-2">Terminal Destino</h4>
              <p className="text-sm font-medium">Terminal Guayaquil (Pascuales)</p>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-4 py-2 text-left">Cant.</th>
                  <th className="px-4 py-2 text-left">Descripción del Bulto</th>
                  <th className="px-4 py-2 text-right">Peso Est.</th>
                  <th className="px-4 py-2 text-right">Valor</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-2">01</td>
                  <td className="px-4 py-2">Caja de repuestos electrónicos (Frágil)</td>
                  <td className="px-4 py-2 text-right">5.00 kg</td>
                  <td className="px-4 py-2 text-right">$17.50</td>
                </tr>
              </tbody>
              <tfoot className="bg-slate-50 font-bold">
                <tr>
                  <td colSpan={3} className="px-4 py-2 text-right">TOTAL CANCELADO</td>
                  <td className="px-4 py-2 text-right text-primary text-lg">$17.50</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="flex justify-between items-end pt-8">
            <div className="text-center">
              <QrCode className="w-24 h-24 mx-auto mb-2 opacity-50" />
              <p className="text-[10px] text-slate-400">Validar en: translog.com/verificar</p>
            </div>
            <div className="text-right space-y-1">
              <p className="text-xs text-slate-500">Recibido por: Empleado Terminal 01</p>
              <p className="text-xs text-slate-500">Fecha: 20/03/2024 14:20</p>
              <div className="pt-4">
                <div className="w-48 border-t border-slate-300 mx-auto"></div>
                <p className="text-[10px] text-slate-400 text-center mt-1">Firma Autorizada</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuideView;