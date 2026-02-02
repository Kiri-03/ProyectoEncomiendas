"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { Encomienda } from '@/types/encomienda';

interface StatusBadgeProps {
  status: Encomienda['status'];
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const styles = {
    pendiente: "bg-amber-100 text-amber-700 border-amber-200",
    en_camino: "bg-blue-100 text-blue-700 border-blue-200",
    entregado: "bg-emerald-100 text-emerald-700 border-emerald-200",
  };

  const labels = {
    pendiente: "Pendiente",
    en_camino: "En Camino",
    entregado: "Entregado",
  };

  return (
    <span className={cn(
      "px-2.5 py-0.5 rounded-full text-xs font-bold border",
      styles[status],
      className
    )}>
      {labels[status]}
    </span>
  );
};

export default StatusBadge;