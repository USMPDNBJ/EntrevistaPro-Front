import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private apiUrl = environment.apiUrlUser;

  constructor(private http: HttpClient) {}

  register(userData: {
    correo: string;
    contrasena: string;
    nombres: string;
    apellidos: string;
    dni: string;
    celular: string;
    habilidades: string[];
  }): Observable<any> {
    console.log('URL de la petición:', this.apiUrl);
    return this.http.post(this.apiUrl, userData, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
