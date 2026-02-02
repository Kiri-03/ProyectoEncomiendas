export type UserRole = 'administrador' | 'empleado' | 'cliente' | 'conductor';

export interface UserProfile {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  telefono: string;
  rol: UserRole;
  fecha_registro: string;
}

export interface Office {
  id: string;
  name: string;
  city: string;
  address: string;
}

export interface EncomiendaItem {
  description: string;
  weight: number;
  type: 'sobre' | 'paquete' | 'caja' | 'especial';
  price: number;
}

export interface Encomienda {
  id: string;
  trackingCode: string;
  senderId: string;
  receiverName: string;
  receiverPhone: string;
  originOfficeId: string;
  destinationOfficeId: string;
  items: EncomiendaItem[];
  subtotal: number;
  status: 'pendiente' | 'en_camino' | 'entregado';
  busId?: string;
  createdAt: string;
}