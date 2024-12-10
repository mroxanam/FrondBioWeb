import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface UsuarioRegistrado {
  id: number;
  dni: number;
  email: string;
  username: string;
  rol: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuariosRegistradosService {
  private apiUrl = `${environment.apiUrl}/api/UsuariosRegistrados`;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
    withCredentials: true
  };

  constructor(private http: HttpClient) { }

  // Obtener usuario actual autenticado
  getUsuarioActual(): Observable<UsuarioRegistrado> {
    return this.http.get<UsuarioRegistrado>(`${this.apiUrl}/actual`, this.httpOptions).pipe(
      tap(response => console.log('Usuario actual:', response)),
      catchError(this.handleError)
    );
  }

  // Obtener todos los usuarios registrados
  getUsuarios(): Observable<UsuarioRegistrado[]> {
    return this.http.get<UsuarioRegistrado[]>(this.apiUrl, this.httpOptions).pipe(
      tap(response => console.log('Usuarios obtenidos:', response)),
      catchError(this.handleError)
    );
  }

  // Obtener usuario por ID
  getUsuarioById(id: number): Observable<UsuarioRegistrado> {
    return this.http.get<UsuarioRegistrado>(`${this.apiUrl}/${id}`, this.httpOptions).pipe(
      tap(response => console.log('Usuario obtenido:', response)),
      catchError(this.handleError)
    );
  }

  // Obtener usuario por DNI
  getUsuarioByDni(dni: number): Observable<UsuarioRegistrado> {
    return this.http.get<UsuarioRegistrado>(`${this.apiUrl}/porDNI/${dni}`, this.httpOptions).pipe(
      tap(response => console.log('Usuario obtenido:', response)),
      catchError(this.handleError)
    );
  }

  // Actualizar usuario
  updateUsuario(id: number, usuario: Partial<UsuarioRegistrado>): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, usuario, this.httpOptions).pipe(
      tap(() => console.log('Usuario actualizado')),
      catchError(this.handleError)
    );
  }

  // Eliminar usuario
  deleteUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.httpOptions).pipe(
      tap(() => console.log('Usuario eliminado')),
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('Error en la operación:', error);
    return Promise.reject(error.message || error);
  }
}
