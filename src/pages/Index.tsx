"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Truck, Search, Bus, Menu, ArrowRight, Package, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Index = () => {
  const NavLinks = () => (
    <>
      <a href="#servicios" className="text-sm font-medium text-slate-600 hover:text-primary">Servicios</a>
      <Link to="/rastreo">
        <Button variant="ghost" className="gap-2 w-full justify-start md:justify-center">
          <Search className="w-4 h-4" /> Rastrear Encomienda
        </Button>
      </Link>
      <Link to="/conductor">
        <Button variant="ghost" className="gap-2 w-full justify-start md:justify-center text-slate-600 hover:text-primary">
          <Bus className="w-4 h-4" /> App Conductor
        </Button>
      </Link>
      <Link to="/login">
        <Button className="rounded-full px-6 w-full">Acceso Personal</Button>
      </Link>
    </>
  );

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bus className="w-10 h-10 text-primary" />
            <span className="text-2xl font-black italic tracking-tighter text-primary">TRANSLOG</span>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <NavLinks />
          </div>

          {/* Mobile Nav */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col gap-6 mt-10">
                  <NavLinks />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <section className="relative py-12 lg:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
                Cooperativa de Transporte Interprovincial
              </div>
              <h1 className="text-4xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
                Viaja seguro, <br />
                <span className="text-primary">envía con confianza.</span>
              </h1>
              <p className="text-lg text-slate-500 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Conectamos ciudades con nuestra flota de buses modernos. Tus encomiendas viajan seguras en cada ruta nacional.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/rastreo">
                  <Button size="lg" className="h-14 px-8 text-lg rounded-full gap-2 shadow-lg shadow-primary/20">
                    Rastrear mi paquete <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="relative bg-slate-100 rounded-3xl aspect-video overflow-hidden shadow-2xl border-8 border-white">
                <img 
                  src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1000" 
                  alt="Bus de transporte" 
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="servicios" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Bus, title: "Transporte de Pasajeros", desc: "Buses de última generación con máximo confort." },
              { icon: Package, title: "Encomiendas en Bodega", desc: "Rapidez y seguridad en el envío de tus paquetes." },
              { icon: MapPin, title: "Cobertura Nacional", desc: "Presencia en los principales terminales del país." }
            ].map((f, i) => (
              <Card key={i} className="border-none shadow-sm p-8 space-y-4 bg-white rounded-2xl">
                <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                  <f.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">{f.title}</h3>
                <p className="text-slate-500">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-6">
          <p className="text-slate-400 text-sm">© 2024 Cooperativa TransLog. Todos los derechos reservados.</p>
          <MadeWithDyad />
        </div>
      </footer>
    </div>
  );
};

import { Card } from '@/components/ui/card';
export default Index;