"use client";

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { showSuccess, showError } from '@/utils/toast';
import { Package, User, MapPin, Bus as BusIcon, Calculator, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '@/lib/api-client';

const CreateEncomienda = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [availableBuses, setAvailableBuses] = useState<any[]>([]);
  const [terminals, setTerminals] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    remitente: '',
    cedula: '',
    destinatario: '',
    telefono: '',
    descripcion: '',
    peso: '',
    tipo: '',
    destino: '',
    bus: ''
  });

  useEffect(() => {
    // Cargar buses disponibles al iniciar o llegar al paso 4
    const fetchTerminals = async () => {
      try {
        const data = await apiClient.encomiendas.getTerminals();
        setTerminals(data);
      } catch (error) {
        console.error("Error loading terminals", error);
      }
    };
    const fetchBuses = async () => {
      try {
        const data = await apiClient.tracking.getBuses();
        setAvailableBuses(data);
      } catch (error) {
        console.error("Error loading buses", error);
      }
    };
    fetchBuses();
    fetchTerminals();
  }, []);

  const validateStep = () => {
    if (step === 1) {
      const cedulaValid = /^\d{10}$/.test(formData.cedula);
      const telefonoValid = /^\d{10}$/.test(formData.telefono);
      if (!cedulaValid) showError("La cédula debe tener 10 dígitos numéricos.");
      if (!telefonoValid) showError("El teléfono debe tener 10 dígitos numéricos.");
      return formData.remitente && cedulaValid && formData.destinatario && telefonoValid;
    }
    if (step === 2) {
      return formData.descripcion && formData.peso && formData.tipo;
    }
    if (step === 3) {
      return formData.destino;
    }
    if (step === 4) {
      return formData.bus;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    } else {
      showError("Por favor, complete todos los campos obligatorios.");
    }
  };

  const handlePrev = () => setStep(step - 1);

  const handleSubmit = async () => {
    if (validateStep()) {
      try {
        const payload = {
          remitente_nombre: formData.remitente,
          destinatario_nombre: formData.destinatario,
          destino_direccion: formData.destino,
          peso: parseFloat(formData.peso),
          tipo: formData.tipo
        };

        const response = await apiClient.encomiendas.create(payload);
        
        // Si se seleccionó bus, intentar despachar (opcional)
        if (formData.bus && response.id) {
           await apiClient.encomiendas.update(response.id, { bus_id: formData.bus });
        }

        showSuccess(`Encomienda registrada: ${response.tracking_code}`);
        navigate(`/guia/${response.tracking_code}`);
      } catch (err) {
        showError("Error al registrar la encomienda en el servidor.");
      }
    } else {
      showError("Faltan datos por completar.");
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Filtrar buses según el destino seleccionado
  const selectedTerminal = terminals.find(t => t.nombre === formData.destino);
  const filteredBuses = availableBuses.filter(bus => !selectedTerminal || bus.destino === selectedTerminal.ciudad);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between mb-8 relative px-2">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className={`z-10 flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all ${step >= s ? 'bg-primary text-white scale-110' : 'bg-slate-200 text-slate-500'}`}>
              {s}
            </div>
          ))}
          <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-200 -z-0"></div>
        </div>

        <Card className="border-none shadow-lg overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b">
            <CardTitle className="flex items-center gap-2 text-slate-800">
              {step === 1 && <><User className="w-5 h-5 text-primary" /> Datos del Cliente</>}
              {step === 2 && <><Package className="w-5 h-5 text-primary" /> Detalles de Carga</>}
              {step === 3 && <><MapPin className="w-5 h-5 text-primary" /> Terminal de Destino</>}
              {step === 4 && <><BusIcon className="w-5 h-5 text-primary" /> Asignación de Bus</>}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Remitente *</Label>
                  <Input value={formData.remitente} onChange={(e) => updateField('remitente', e.target.value)} placeholder="Nombre completo" />
                </div>
                <div className="space-y-2">
                  <Label>Cédula / RUC *</Label>
                  <Input 
                    value={formData.cedula} 
                    onChange={(e) => updateField('cedula', e.target.value.replace(/\D/g, '').slice(0, 10))} 
                    placeholder="10 dígitos" 
                    maxLength={10}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Destinatario *</Label>
                  <Input value={formData.destinatario} onChange={(e) => updateField('destinatario', e.target.value)} placeholder="Nombre completo" />
                </div>
                <div className="space-y-2">
                  <Label>Teléfono Destinatario *</Label>
                  <Input 
                    value={formData.telefono} 
                    onChange={(e) => updateField('telefono', e.target.value.replace(/\D/g, '').slice(0, 10))} 
                    placeholder="0987654321" 
                    maxLength={10}
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-slate-50 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Descripción *</Label>
                    <Input value={formData.descripcion} onChange={(e) => updateField('descripcion', e.target.value)} placeholder="Ej: Caja de ropa" />
                  </div>
                  <div className="space-y-2">
                    <Label>Peso Est. (kg) *</Label>
                    <Input type="number" value={formData.peso} onChange={(e) => updateField('peso', e.target.value)} placeholder="0.00" />
                  </div>
                  <div className="space-y-2">
                    <Label>Tipo de Bulto *</Label>
                    <Select onValueChange={(v) => updateField('tipo', v)}>
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
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-600" />
                  <p className="text-sm text-blue-700 font-medium">Origen: Terminal Terrestre Quitumbe (Quito)</p>
                </div>
                <div className="space-y-2">
                  <Label>Terminal de Destino *</Label>
                  <Select onValueChange={(v) => updateField('destino', v)}>
                    <SelectTrigger><SelectValue placeholder="Seleccione terminal" /></SelectTrigger>
                    <SelectContent>
                      {terminals.map((t) => (
                        <SelectItem key={t.id} value={t.nombre}>{t.nombre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <Label>Buses con Salida Próxima *</Label>
                <div className="space-y-3">
                  {filteredBuses.length > 0 ? filteredBuses.map((bus) => (
                    <div 
                      key={bus.id}
                      onClick={() => updateField('bus', bus.id)}
                      className={`p-4 border-2 rounded-xl flex justify-between items-center cursor-pointer transition-all ${formData.bus === bus.id ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-slate-300'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${formData.bus === bus.id ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'}`}>
                          <BusIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-bold text-lg">DISCO {bus.numero_disco}</p>
                          <p className="text-sm text-slate-500">Placa: {bus.placa} | Salida: {bus.hora_salida}</p>
                        </div>
                      </div>
                      {formData.bus === bus.id && <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs">✓</div>}
                    </div>
                  )) : (
                    <p className="text-slate-500 text-center py-4">No hay buses disponibles para el destino seleccionado.</p>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-between pt-6 border-t">
              <Button variant="outline" onClick={handlePrev} disabled={step === 1}>Anterior</Button>
              {step < 4 ? (
                <Button onClick={handleNext}>Siguiente</Button>
              ) : (
                <Button onClick={handleSubmit} className="bg-emerald-600 hover:bg-emerald-700">Finalizar Registro</Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CreateEncomienda;