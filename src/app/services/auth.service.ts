import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

interface LoginResponse {
  status: number;
  message: string;
  data: {
    id: number;
    rol: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private userIdSubject = new BehaviorSubject<number | null>(null);
  private rolSubject = new BehaviorSubject<string | null>(null);
  userId$ = this.userIdSubject.asObservable();
  rol$ = this.rolSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const userId = localStorage.getItem('userId');
      const rol = localStorage.getItem('rol');
      this.userIdSubject.next(userId ? Number(userId) : null);
      this.rolSubject.next(rol);
      console.log(`Loaded from localStorage - userId: ${userId}, rol: ${rol}`);
    }
  }

  login(credentials: { correo: string; contrasena: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        const userId = response.data.id;
        const rol = response.data.rol.toLowerCase();
        console.log(`Login - userId: ${userId}, rol: ${rol}`);
        if (userId && rol) {
          this.userIdSubject.next(userId);
          this.rolSubject.next(rol);
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('userId', userId.toString());
            localStorage.setItem('rol', rol);
            console.log(`Saved to localStorage - userId: ${userId}, rol: ${rol}`);
          }
        }
      })
    );
  }

  getUserId(): number | null {
    return this.userIdSubject.value;
  }

  getRol(): string | null {
    return this.rolSubject.value;
  }

  clearUserId() {
    this.userIdSubject.next(null);
    this.rolSubject.next(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('userId');
      localStorage.removeItem('rol');
      console.log(`localStorage cleared`);
    }
  }

  isAuthenticated(): boolean {
    return !!this.userIdSubject.value;
  }
}
