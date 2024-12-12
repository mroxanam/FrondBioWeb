export interface FacturaDto {
    numeroFactura: string;
    fechaEmision: Date;
    fechaVencimiento: Date;
    consumoMensual: number;
    consumoTotal: number;
}
