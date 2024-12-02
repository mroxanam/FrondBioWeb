import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.apiUrl;
  private roleSubject = new BehaviorSubject<string>('');
  private usernameSubject = new BehaviorSubject<string>('');

  userRole$ = this.roleSubject.asObservable();
  username$ = this.usernameSubject.asObservable();

  constructor(private http: HttpClient) { }

  getUserInfo() {
    // Obtener la información del usuario del localStorage o de donde la tengas almacenada
    const userInfo = {
      role: localStorage.getItem('userRole') || '',
      username: localStorage.getItem('username') || ''
    };
    this.roleSubject.next(userInfo.role);
    this.usernameSubject.next(userInfo.username);
    return userInfo;
  }

  actualizarCredenciales(credenciales: {
    nuevoUsername: string,
    nuevaPassword: string,
    passwordActual: string
  }): Observable<any> {
    const endpoint = `${this.baseUrl}/Auth/actualizar-credenciales`;
    
    // Convertir los nombres de las propiedades para que coincidan con el DTO del backend
    const requestBody = {
      NuevoUsername: credenciales.nuevoUsername,
      NuevaPassword: credenciales.nuevaPassword,
      PasswordActual: credenciales.passwordActual
    };

    console.log('URL de la petición:', endpoint);
    console.log('Datos enviados:', requestBody);

    // Agregar el tipo de contenido y manejar las cookies
    const headers = { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    return this.http.put(endpoint, requestBody, { 
      headers,
      withCredentials: true // Importante para enviar las cookies de autenticación
    });
  }
}
