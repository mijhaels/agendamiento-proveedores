import { Product } from './Product';
import { Provider } from './Provider';

export interface ReservationDetail {
    idProducto: number;
    cantidad: number;
    product?: Product;
  }
  
  export interface Reservation {
    id?: number;
    fecha: string;
    horaInicioAgendamiento: string;
    horaFinAgendamiento: string;
    idProveedor: number;
    proveedor?: Provider;
    idJaula?: number;
    horaInicioRecepcion?: string;
    horaFinRecepcion?: string;
    detalle: ReservationDetail[];
  }