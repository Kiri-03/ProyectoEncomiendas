import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { showSuccess } from '@/utils/toast';
import { Package, User, MapPin, Bus as BusIcon, Calculator } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreateEncomienda = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const handleNext = () => setStep(step + 1);
  const handlePrev = () => setStep(step - 1);

  const handleSubmit = () => {
    showSuccess("Encomienda registrada y asignada al bus");
    navigate('/guia/001-000452');
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between mb-8 relative">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className={`z-10 flex items-center justify-center w-10 h-10 rounded-full font-bold ${step >= s ? 'bg-primary text-white' : 'bg-slate-200 text-slate-500'}`}>
              {s}
            </div>
          ))}
          <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-200 -z-0"></div>
        </div>

        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {step === 1 && <><User className="w-5 h-5" /> Datos del Cliente</>}
              {step === 2 && <><Package className="w-5 h-5" /> Detalles de Carga</>}
              {step === 3 && <><MapPin className="w-5 h-5" /> Terminal de Destino</>}
              {step === 4 && <><BusIcon className="w-5 h-5" /> Asignación de Bus</>}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Remitente</Label>
                  <Input placeholder="Nombre completo" />
                </div>
                <div className="space-y-2">
                  <Label>Cédula / RUC</Label>
                  <Input placeholder="Documento" />
                </div>
                <div className="space-y-2">
                  <Label>Destinatario</Label>
                  <Input placeholder="Nombre completo" />
                </div>
                <div className="space-y-2">
                  <Label>Teléfono Destinatario</Label>
                  <Input placeholder="0987654321" />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-slate-50 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Descripción</Label>
                    <Input placeholder="Ej: Caja de ropa" />
                  </div>
                  <div className="space-y-2">
                    <Label>Peso Est. (kg)</Label>
                    <Input type="number" placeholder="0.00" />
                  </div>
                  <div className="space-y-2">
                    <Label>Tipo de Bulto</Label>
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Tipo" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sobre">Sobre / Documento</SelectItem>
                        <SelectItem value="paquete">Paquete Pequeño</SelectItem>
                        <SelectItem value="caja">Caja Mediana</SelectItem>
                        <SelectItem value="saco">Saco / Bulto Grande</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-primary/10 p-4 rounded-lg flex items-center gap-3">
                    <Calculator className="text-primary" />
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-bold">Valor del Envío</p>
                      <p className="text-xl font-bold text-primary">$17.50</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                  <p className="text-sm text-blue-700 font-medium">Origen: Terminal Terrestre Quitumbe (Quito)</p>
                </div>
                <div className="space-y-2">
                  <Label>Terminal de Destino</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Seleccione terminal" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="guayaquil">Terminal Terrestre Guayaquil</SelectItem>
                      <SelectItem value="cuenca">Terminal Terrestre Cuenca</SelectItem>
                      <SelectItem value="manta">Terminal Terrestre Manta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <Label>Buses con Salida Próxima</Label>
                <div className="space-y-3">
                  <div className="p-4 border-2 border-primary bg-primary/5 rounded-xl flex justify-between items-center cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary text-white p-3 rounded-lg">
                        <BusIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-lg">DISCO 045</p>
                        <p className="text-sm text-slate-500">Placa: ABC-1234 | Conductor: C. Rodríguez</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-emerald-600">ESPACIO DISPONIBLE</p>
                      <p className="text-sm font-bold">Salida: 18:30 PM</p>
                    </div>
                  </div>
                  
                  <div className="p-4 border border-slate-200 rounded-xl flex justify-between items-center opacity-60 grayscale">
                    <div className="flex items-center gap-4">
                      <div className="bg-slate-200 text-slate-500 p-3 rounded-lg">
                        <BusIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-lg">DISCO 102</p>
                        <p className="text-sm text-slate-500">Placa: XYZ-9876 | Conductor: J. Loor</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-red-500">BODEGA LLENA</p>
                      <p className="text-sm font-bold">Salida: 19:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-6">
              <Button variant="outline" onClick={handlePrev} disabled={step === 1}>Anterior</Button>
              {step < 4 ? (
                <Button onClick={handleNext}>Siguiente</Button>
              ) : (
                <Button onClick={handleSubmit} className="bg-emerald-600 hover:bg-emerald-700">Finalizar y Emitir Guía</Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CreateEncomienda;