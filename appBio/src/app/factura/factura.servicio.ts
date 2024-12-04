import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {
  private apiUrl = 'http://localhost:5068/api/Factura'; // URL de la API

  constructor(private http: HttpClient) {}
  obtenerFacturasPorRol(rol: string): Observable<any[]> {
    const params = new HttpParams().set('rol', rol);
    return this.http.get<any[]>(`${this.apiUrl}/por-rol`, { params });
  }
  

  obtenerFactura(numeroFactura: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${numeroFactura}`);
  }

  obtenerFacturas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl); // Obtiene todas las facturas
  }
}
