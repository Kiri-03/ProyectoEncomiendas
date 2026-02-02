"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Truck, Shield, Clock, MapPin, ArrowRight, Package, Search, Users, Bus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MadeWithDyad } from '@/components/made-with-dyad';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bus className="w-10 h-10 text-primary" />
            <span className="text-2xl font-black italic tracking-tighter text-primary">TRANSLOG</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#servicios" className="text-sm font-medium text-slate-600 hover:text-primary">Servicios</a>
            <a href="#rutas" className="text-sm font-medium text-slate-600 hover:text-primary">Rutas y Horarios</a>
            <Link to="/rastreo">
              <Button variant="ghost" className="gap-2">
                <Search className="w-4 h-4" /> Rastrear Encomienda
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button className="rounded-full px-6">Acceso Personal</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Cooperativa de Transporte Interprovincial
              </div>
              <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
                Viaja seguro, <br />
                <span className="text-primary">envía con confianza.</span>
              </h1>
              <p className="text-xl text-slate-500 max-w-lg leading-relaxed">
                Conectamos ciudades con nuestra flota de buses modernos. Pasajeros y encomiendas viajan seguros en cada ruta nacional.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/rastreo">
                  <Button size="lg" className="h-14 px-8 text-lg rounded-full gap-2 w-full sm:w-auto shadow-lg shadow-primary/20">
                    Rastrear mi paquete <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full w-full sm:w-auto">
                  Ver Horarios de Salida
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
              <div className="relative bg-slate-100 rounded-3xl aspect-video overflow-hidden shadow-2xl border-8 border-white">
                <img 
                  src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1000" 
                  alt="Bus de transporte" 
                  className="object-cover w-full h-full"
                />
                <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur p-6 rounded-2xl shadow-xl border border-white">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary rounded-xl text-white">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Más que transporte</p>
                      <p className="text-xs text-slate-500">Servicio de pasajeros y carga en bodega</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="servicios" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl font-bold text-slate-900">Nuestros Servicios</h2>
            <p className="text-slate-500">Ofrecemos soluciones integrales para tus viajes y el envío de tus pertenencias a nivel nacional.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: Bus, 
                title: "Transporte de Pasajeros", 
                desc: "Buses de última generación con asientos reclinables, aire acondicionado y WiFi para un viaje placentero." 
              },
              { 
                icon: Package, 
                title: "Encomiendas en Bodega", 
                desc: "Tus paquetes viajan en el mismo bus de la ruta, garantizando rapidez y entrega en terminales terrestres." 
              },
              { 
                icon: MapPin, 
                title: "Cobertura Nacional", 
                desc: "Presencia en los principales terminales terrestres del país con horarios frecuentes todos los días." 
              }
            ].map((f, i) => (
              <Card key={i} className="border-none shadow-sm hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-8 space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <f.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{f.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats / Trust */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary rounded-[3rem] p-12 lg:p-20 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 -skew-x-12 translate-x-1/2"></div>
            <div className="relative z-10 grid md:grid-cols-3 gap-12 text-center">
              <div>
                <p className="text-5xl font-black mb-2">40+</p>
                <p className="text-primary-foreground/80 font-medium uppercase tracking-widest text-sm">Años de Experiencia</p>
              </div>
              <div>
                <p className="text-5xl font-black mb-2">120</p>
                <p className="text-primary-foreground/80 font-medium uppercase tracking-widest text-sm">Buses en Flota</p>
              </div>
              <div>
                <p className="text-5xl font-black mb-2">24/7</p>
                <p className="text-primary-foreground/80 font-medium uppercase tracking-widest text-sm">Monitoreo GPS</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-6">
          <div className="flex items-center justify-center gap-2">
            <Bus className="w-8 h-8 text-primary" />
            <span className="text-xl font-black italic tracking-tighter">TRANSLOG</span>
          </div>
          <p className="text-slate-400 text-sm">© 2024 Cooperativa de Transporte TransLog. Todos los derechos reservados.</p>
          <MadeWithDyad />
        </div>
      </footer>
    </div>
  );
};

export default Index;