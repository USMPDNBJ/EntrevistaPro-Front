import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environmentSession } from '../../environments/environment';
import Session from '../models/sessions';
import Agendar from '../models/agendar';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
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
  postSession(session: Agendar): Observable<Session> {
    const url = this.apiUrl; // Asegúrate de que esta URL coincida con tu API

    console.log('Enviando sesión a la URL:', url);

    return this.http.post<{ status: number, message: string, data: Session }>(url, session, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      map(response => response.data) // Extraemos la "data" de la respuesta
    );
  }
}
