import { DomicilioDto } from './domicilio.interface';
import { FacturaDto } from './factura.interface';

export interface Cliente {
    numeroCliente: number;
    dni: number;  // Cambiado de DNI a dni para coincidir con el backend
    nombre: string;
    apellido: string;
    email: string;
}

export interface ClienteDto extends Cliente {
    domicilios?: DomicilioDto[];
    facturas?: FacturaDto[];
}
