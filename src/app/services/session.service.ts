import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environmentSession } from '../../environments/environment';
import Session from '../models/sessions';

@Injectable({
  providedIn: 'root'
})
export class UserService {
 private apiUrl = environmentSession.apiUrl; // URL base desde environment

  constructor(private http: HttpClient) {}

  // Método para obtener las sesiones de un usuario por ID
  getSessionsByUserId(userId: string): Observable<Session[]> {
    const url = `${this.apiUrl}/user/${userId}`;
    console.log('URL de la petición:', url);

    return this.http.get<{ status: number, message: string, data: Session[] }>(url, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      map(response => response.data) // Extraemos solo la parte "data" de la respuesta
    );
  }
}
