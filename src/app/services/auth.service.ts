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
    rol: string; // "User" o "Admin"
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrlUser;
  private userIdSubject = new BehaviorSubject<number | null>(null);
  private rolSubject = new BehaviorSubject<string | null>(null);
  userId$ = this.userIdSubject.asObservable();
  rol$ = this.rolSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const userId = sessionStorage.getItem('userId');
      const rol = sessionStorage.getItem('rol');
      console.log('AuthService: Inicializando desde localStorage', { userId, rol });
      this.userIdSubject.next(userId ? Number(userId) : null);
      this.rolSubject.next(rol);
    }
  }

  login(credentials: { correo: string; contrasena: string }): Observable<LoginResponse> {
    console.log(credentials.correo,'→')
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        const userId = response.data.id;
        const rol = response.data.rol.toLowerCase();
        console.log('AuthService: Login exitoso', { userId, rol });
        if (userId && rol) {
          this.userIdSubject.next(userId);
          this.rolSubject.next(rol);
          if (isPlatformBrowser(this.platformId)) {
            sessionStorage.setItem('userId', userId.toString());
            sessionStorage.setItem('rol', rol);
            console.log('AuthService: Guardado en localStorage', { userId, rol });
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
      sessionStorage.removeItem('userId');
      sessionStorage.removeItem('rol');
      console.log('AuthService: localStorage limpiado');
    }
  }

  isAuthenticated(): boolean {
    const isAuth = !!this.userIdSubject.value;
    console.log('AuthService: isAuthenticated', isAuth);
    return isAuth;
  }
}
