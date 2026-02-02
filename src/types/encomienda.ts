export type UserRole = 'administrador' | 'empleado' | 'cliente' | 'conductor';

export type EncomiendaStatus = 'en_bodega_origen' | 'en_transito' | 'en_bodega_destino' | 'entregado' | 'devuelto';

export interface Bus {
  id: string;
  numeroDisco: string;
  placa: string;
  conductor: string;
}

export interface Encomienda {
  id: string;
  trackingCode: string;
  senderId: string;
  receiverName: string;
  receiverPhone: string;
  originOfficeId: string;
  destinationOfficeId: string;
  status: EncomiendaStatus;
  busId?: string;
  subtotal: number;
  createdAt: string;
}