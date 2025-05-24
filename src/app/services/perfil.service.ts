import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface User {
  id: number;
  correo: string;
  contrasena: string;
  nombres: string;
  apellidos: string;
  dni: string;
  celular: string;
  habilidades: string[];
}

interface ApiResponse {
  status: number;
  message: string;
  data: User;
}

@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  private apiUrl = environment.apiUrlUser;

  constructor(private http: HttpClient) {}

  getUser(id: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/${id}`);
  }
}
