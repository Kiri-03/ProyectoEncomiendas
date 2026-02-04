"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer, Mail, Download, QrCode, Bus, Loader2, ArrowLeft } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { showError } from '@/utils/toast';
import Layout from '@/components/Layout';

const GuideView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [guide, setGuide] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        if (!id) return;
        const data = await apiClient.encomiendas.getOne(id);
        setGuide(data);
      } catch (err) {
        showError("No tienes permiso para ver esta guía o no existe.");
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchGuide();
  }, [id, navigate]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (!guide) return null;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Volver
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><Printer className="w-4 h-4 mr-2" /> Imprimir</Button>
            <Button size="sm"><Download className="w-4 h-4 mr-2" /> PDF</Button>
          </div>
        </div>

        <Card className="border-2 border-slate-200 shadow-none">
          <CardHeader className="border-b bg-slate-50">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-primary text-3xl font-black italic">COOPERATIVA TRANSLOG</CardTitle>
                <p className="text-sm text-slate-500">RUC: 1791234567001</p>
              </div>
              <div className="text-right border-2 border-primary p-4 rounded-lg bg-white">
                <p className="text-xs font-bold text-primary">GUÍA DE REMISIÓN</p>
                <p className="text-xl font-mono font-bold">{guide.tracking_code}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h4 className="font-bold text-slate-400 uppercase text-[10px] mb-2">Remitente</h4>
                <p className="font-semibold">{guide.sender_name || 'Cliente General'}</p>
                <p className="text-sm text-slate-600">CI: {guide.sender_dni || 'N/A'}</p>
              </div>
              <div>
                <h4 className="font-bold text-slate-400 uppercase text-[10px] mb-2">Destinatario</h4>
                <p className="font-semibold">{guide.receiver_name}</p>
                <p className="text-sm text-slate-600">Telf: {guide.receiver_phone}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <h4 className="font-bold text-primary uppercase text-[10px] mb-2 flex items-center gap-1">
                  <Bus className="w-3 h-3" /> Transporte
                </h4>
                <p className="font-bold text-lg">{guide.bus_id || 'Por asignar'}</p>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="px-4 py-2 text-left">Descripción</th>
                    <th className="px-4 py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-2">Servicio de Encomienda - {guide.status}</td>
                    <td className="px-4 py-2 text-right">${guide.subtotal?.toFixed(2)}</td>
                  </tr>
                </tbody>
                <tfoot className="bg-slate-50 font-bold">
                  <tr>
                    <td className="px-4 py-2 text-right">TOTAL</td>
                    <td className="px-4 py-2 text-right text-primary text-lg">${guide.subtotal?.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="flex justify-between items-end pt-8">
              <QrCode className="w-24 h-24 opacity-50" />
              <div className="text-right space-y-1">
                <p className="text-xs text-slate-500">Fecha: {new Date(guide.created_at).toLocaleString()}</p>
                <div className="pt-4">
                  <div className="w-48 border-t border-slate-300"></div>
                  <p className="text-[10px] text-slate-400 text-center mt-1">Firma Autorizada</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default GuideView;