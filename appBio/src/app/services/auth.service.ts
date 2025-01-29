import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private roleSubject = new BehaviorSubject<string>('');
  private usernameSubject = new BehaviorSubject<string>('');
  private baseUrl = environment.apiUrl;

  userRole$ = this.roleSubject.asObservable();
  username$ = this.usernameSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkAuthStatus();
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/Auth/login`, { username, password }, { withCredentials: true })
    .pipe(
      catchError(err => {
        console.error('Login error', err); // Manejo de error
        return throwError(err);
      })
    );
  }   

  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/Auth/logout`, {}, { withCredentials: true });
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/Auth/register`, userData, { withCredentials: true });
  }

  verificarDNI(dni: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/Auth/verificarDNI`, { DNI: dni }, { withCredentials: true });
  }

  checkAuthStatus() {
    this.http.get(`${this.baseUrl}/Auth/user`, { withCredentials: true })
      .subscribe({
        next: (user: any) => {
          if (user) {
            this.roleSubject.next(user.rol || '');
            this.usernameSubject.next(user.username || '');
          }
        },
        error: (err) => {
          console.error('Error checking auth status', err);
          this.roleSubject.next('');
          this.usernameSubject.next('');
        }
      });
  }

  getUserInfo() : { role: string, username: string } {
    const userInfo = {
      role: this.roleSubject.value,
      username: this.usernameSubject.value
    };
    return userInfo;
  }

  actualizarCredenciales(credenciales: {
    nuevoUsername: string,
    nuevaPassword: string,
    passwordActual: string
  }): Observable<any> {
    if (!credenciales.nuevoUsername || !credenciales.nuevaPassword || !credenciales.passwordActual) {
      return throwError('Todos los campos son obligatorios');
    }

    return this.http.put(`${this.baseUrl}/Auth/actualizar-credenciales`, {
      NuevoUsername: credenciales.nuevoUsername,
      NuevaPassword: credenciales.nuevaPassword,
      PasswordActual: credenciales.passwordActual
    }, { withCredentials: true });
  }
}
