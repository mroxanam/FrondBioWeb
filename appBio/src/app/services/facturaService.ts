import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { FacturaDto } from '../models/factura.interface';
import { Cliente, ClienteDto } from '../models/cliente.interface';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FacturaService {
  private apiUrl = 'http://localhost:5068/api/Factura';

  constructor(private http: HttpClient) {}

  getClientes(): Observable<ClienteDto[]> {
    return this.http.get<ClienteDto[]>('http://localhost:5068/UsuarioAdministrador/Cliente');
  }

  getClienteDatosTotales(dni: number): Observable<ClienteDto> {
    return this.http.get<ClienteDto>(`http://localhost:5068/UsuarioAdministrador/Cliente/${dni}/datos-totales`);
  }

  getFacturasByDni(dni: number): Observable<FacturaDto[]> {
    return this.http.get<FacturaDto[]>(`${this.apiUrl}/cliente/${dni}`).pipe(
      tap((response: FacturaDto[]) => console.log('Facturas obtenidas:', response)),
      catchError((error: any) => {
        console.error('Error al obtener facturas:', error);
        return throwError(() => new Error('No se pudieron obtener las facturas.'));
      })
    );
  }

  // Crear o actualizar una factura
crearOActualizarFactura(factura: FacturaDto): Observable<FacturaDto> {
  // Asegurar valores predeterminados para evitar errores
  const facturaValida: FacturaDto = {
    ...factura,
    consumoMensual: factura.consumoMensual ?? 0, // Usa nullish coalescing (??) para evitar falsos positivos con 0
    consumoTotal: factura.consumoTotal ?? 0,
  };

  // Determinar si crear o actualizar según el número de factura
  const esActualizacion = !!factura.numeroFactura;

  if (esActualizacion) {
    return this.http.put<FacturaDto>(`${this.apiUrl}/${factura.numeroFactura}`, facturaValida).pipe(
      tap((response) => console.log('Factura actualizada:', response)),
      catchError((error) => {
        console.error('Error al actualizar factura:', error);
        return throwError(() => new Error('No se pudo actualizar la factura. Intente nuevamente.'));
      })
    );
  } else {
    return this.http.post<FacturaDto>(this.apiUrl, facturaValida).pipe(
      tap((response) => console.log('Factura creada:', response)),
      catchError((error) => {
        console.error('Error al crear factura:', error);
        return throwError(() => new Error('No se pudo crear la factura. Intente nuevamente.'));
      })
    );
  }
}

  // Eliminar factura
  eliminarFactura(numeroFactura: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${numeroFactura}`).pipe(
      tap(() => console.log('Factura eliminada con éxito')),
      catchError((error) => {
        console.error('Error al eliminar factura:', error);
        return throwError(() => new Error('No se pudo eliminar la factura.'));
      })
    );
  }

  
  
}