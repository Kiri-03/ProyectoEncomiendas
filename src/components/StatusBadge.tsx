"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { EncomiendaStatus } from '@/types/encomienda';

interface StatusBadgeProps {
  status: EncomiendaStatus;
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const styles: Record<EncomiendaStatus, string> = {
    en_bodega_origen: "bg-amber-100 text-amber-700 border-amber-200",
    en_transito: "bg-blue-100 text-blue-700 border-blue-200",
    en_bodega_destino: "bg-indigo-100 text-indigo-700 border-indigo-200",
    entregado: "bg-emerald-100 text-emerald-700 border-emerald-200",
    devuelto: "bg-red-100 text-red-700 border-red-200",
  };

  const labels: Record<EncomiendaStatus, string> = {
    en_bodega_origen: "En Bodega Origen",
    en_transito: "En Bus (Tránsito)",
    en_bodega_destino: "En Terminal Destino",
    entregado: "Entregado",
    devuelto: "Devuelto",
  };

  return (
    <span className={cn(
      "px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider",
      styles[status],
      className
    )}>
      {labels[status]}
    </span>
  );
};

export default StatusBadge;