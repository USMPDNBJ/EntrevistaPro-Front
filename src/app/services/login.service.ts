import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = environment.apiUrlUser;

  constructor(private http: HttpClient) {}

  login(credentials: { correo: string; contrasena: string }): Observable<any> {
  console.log('URL de la petición:', `${this.apiUrl}/login`);
  return this.http.post(`${this.apiUrl}/login`, credentials, {
    headers: { 'Content-Type': 'application/json' }
  });
}
}
