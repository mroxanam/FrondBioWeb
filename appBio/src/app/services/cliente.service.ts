import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Cliente, ClienteDto } from '../models/cliente.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = `${environment.apiUrl}/UsuarioAdministrador/Cliente`;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
    withCredentials: true
  };

  constructor(private http: HttpClient) { }

  getClientes(): Observable<Cliente[]> {
    console.log('Obteniendo clientes desde:', this.apiUrl);
    return this.http.get<Cliente[]>(this.apiUrl, this.httpOptions).pipe(
      tap(response => console.log('Clientes obtenidos:', response)),
      catchError(this.handleError)
    );
  }

  getClienteByDni(dni: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/${dni}`, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  createCliente(cliente: Partial<Cliente>): Observable<void> {
    console.log('Creando nuevo cliente:', cliente);
    
    // Asegurarse de que todos los campos tengan el tipo correcto
    const clienteToCreate = {
      dni: Number(cliente.dni),
      nombre: String(cliente.nombre || '').trim(),
      apellido: String(cliente.apellido || '').trim(),
      email: String(cliente.email || '').trim()
    };
    
    console.log('Datos a enviar al servidor:', JSON.stringify(clienteToCreate));
    
    return this.http.post<void>(this.apiUrl, clienteToCreate, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }),
      withCredentials: true
    }).pipe(
      tap(() => console.log('Cliente creado correctamente')),
      catchError((error) => {
        console.error('Error al crear cliente:', error);
        return this.handleError(error);
      })
    );
  }

  updateCliente(numeroCliente: number, cliente: Cliente): Observable<void> {
    console.log('Datos recibidos en el servicio:');
    console.log('numeroCliente:', numeroCliente);
    console.log('cliente:', cliente);

    // Asegurarse de que todos los campos tengan el tipo correcto
    const clienteToUpdate = {
      numeroCliente: Number(cliente.numeroCliente),
      dni: Number(cliente.dni),
      nombre: String(cliente.nombre || '').trim(),
      apellido: String(cliente.apellido || '').trim(),
      email: String(cliente.email || '').trim()
    };
    
    // Usar el DNI en la URL en lugar del numeroCliente
    const url = `${this.apiUrl}/${cliente.dni}`;
    console.log('URL de actualización:', url);
    console.log('Datos enviados al servidor (raw):', clienteToUpdate);
    console.log('Datos enviados al servidor (JSON):', JSON.stringify(clienteToUpdate));
    
    // Configurar las opciones HTTP
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }),
      withCredentials: true
    };

    return this.http.put<void>(url, clienteToUpdate, httpOptions).pipe(
      tap(() => console.log('Cliente actualizado correctamente')),
      catchError((error) => {
        console.error('Error completo:', error);
        console.error('Estado de la respuesta:', error.status);
        
        if (error.status === 405) {
          console.error('Error de método no permitido - Verificando autenticación');
          return throwError(() => new Error('Error de autenticación. Por favor, inicie sesión nuevamente.'));
        }
        
        if (typeof error.error === 'string') {
          console.error('Mensaje de error (string):', error.error);
        } else {
          console.error('Mensaje de error (objeto):', JSON.stringify(error.error));
        }
        return this.handleError(error);
      })
    );
  }

  deleteCliente(dni: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${dni}`, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  // Obtener datos totales del cliente por DNI
  getClienteDatosTotales(dni: number): Observable<ClienteDto> {
    const url = `${this.apiUrl}/${dni}/datos-totales`;
    return this.http.get<ClienteDto>(url, {
      headers: new HttpHeaders({
        'Accept': 'application/json'
      }),
      withCredentials: true
    }).pipe(
      tap(response => console.log('Datos totales del cliente:', response)),
      catchError(error => {
        console.error('Error al obtener datos totales del cliente:', error);
        if (error.status === 404) {
          return throwError(() => new Error('Cliente no encontrado.'));
        }
        return this.handleError(error);
      })
    );
  }

  // Buscar cliente por DNI
  buscarClienteByDni(dni: number): Observable<Cliente> {
    const url = `${this.apiUrl}/${dni}`;
    return this.http.get<Cliente>(url, {
      headers: new HttpHeaders({
        'Accept': 'application/json'
      }),
      withCredentials: true
    }).pipe(
      tap(response => console.log('Cliente encontrado:', response)),
      catchError(error => {
        console.error('Error al buscar cliente por DNI:', error);
        return this.handleError(error);
      })
    );
  }

  private handleError(error: any) {
    console.error('Error en la petición HTTP:', error);
    
    let errorMessage = 'Error en la solicitud: ';
    
    if (error.status === 405) {
      errorMessage = 'Error de autenticación. Por favor, inicie sesión nuevamente.';
    } else if (error.status === 400) {
      errorMessage += typeof error.error === 'string' 
        ? error.error 
        : 'Los datos enviados no son válidos';
    } else if (error.error) {
      if (typeof error.error === 'string') {
        errorMessage += error.error;
      } else if (error.error.message) {
        errorMessage += error.error.message;
      }
    }
    
    console.error('Mensaje de error final:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
