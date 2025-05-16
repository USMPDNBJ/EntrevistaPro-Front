import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

interface LoginResponse {
  status: number;
  message: string;
  data: {
    id: number;
    correo: string;
    nombres: string;
    apellidos: string;
    dni: string;
    celular: string;
    habilidades: string[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private userIdSubject = new BehaviorSubject<number | null>(null);
  userId$ = this.userIdSubject.asObservable();
  private instanceId = Math.random().toString(36).substring(2); // Unique ID for debugging

  constructor(private http: HttpClient) {
    console.log(`AuthService instantiated, instance: ${this.instanceId}`);
    this.userId$.subscribe(id => console.log(`userIdSubject changed: ${id}, instance: ${this.instanceId}`));
  }

  login(credentials: { correo: string; contrasena: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        console.log(`Login response, instance: ${this.instanceId}`, response);
        if (response.data?.id) {
          this.userIdSubject.next(response.data.id);
          console.log(`User ID saved: ${response.data.id}, instance: ${this.instanceId}`);
        } else {
          console.warn(`No user ID in response, instance: ${this.instanceId}`);
        }
      })
    );
  }

  getUserId(): number | null {
    const id = this.userIdSubject.value;
    console.log(`Retrieved user ID: ${id}, instance: ${this.instanceId}`);
    return id;
  }

  clearUserId() {
    this.userIdSubject.next(null);
    console.log(`User ID cleared, instance: ${this.instanceId}`);
  }
}
