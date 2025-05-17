import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environmentSession } from '../../environments/environment';
import Session from '../models/sessions';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environmentSession.apiUrl; // Definir la URL base en el archivo de configuración

  constructor(private http: HttpClient) {}

  // Método para obtener las sesiones de un usuario por ID
  getSessionsByUserId(userId: string): Observable<Session[]> {
    const url = `${this.apiUrl}/api/session/user/${userId}`;
    console.log('URL de la petición:', url);

    return this.http.get<Session[]>(url, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
