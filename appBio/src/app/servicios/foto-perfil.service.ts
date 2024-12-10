import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FotoPerfilService {
  private apiUrl = 'http://localhost:5068/api/FotoPerfil';

  constructor(private http: HttpClient) { }

  subirFotoPerfil(archivo: File, usuarioId?: string): Observable<any> {
    const formData = new FormData();
    formData.append('foto', archivo);

    const options = {
      withCredentials: true
    };

    const url = usuarioId ? `${this.apiUrl}/subir/${usuarioId}` : `${this.apiUrl}/subir`;
    return this.http.post(url, formData, options);
  }

  obtenerFotoPerfil(usuarioId?: string): Observable<Blob> {
    const url = usuarioId ? `${this.apiUrl}/obtener/${usuarioId}` : `${this.apiUrl}/obtener`;
    return this.http.get(url, {
      responseType: 'blob',
      withCredentials: true
    });
  }
}
