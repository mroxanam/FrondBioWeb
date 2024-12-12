import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiTestService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  testEndpoint(method: string, path: string, body: any = null): Observable<any> {
    const url = `${this.baseUrl}${path}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    switch (method.toUpperCase()) {
      case 'GET':
        return this.http.get(url, { headers, withCredentials: true });
      case 'POST':
        return this.http.post(url, body, { headers, withCredentials: true });
      case 'PUT':
        return this.http.put(url, body, { headers, withCredentials: true });
      case 'DELETE':
        return this.http.delete(url, { headers, withCredentials: true });
      default:
        throw new Error(`Método HTTP no soportado: ${method}`);
    }
  }
}
