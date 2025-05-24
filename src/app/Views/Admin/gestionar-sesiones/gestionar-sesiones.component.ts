import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

interface Session {
  id: number;
  nombre: string;
  fecha: string;
  hora: string;
  duracion: number;
  estado: string;
}

@Component({
  selector: 'app-gestionar-sesiones',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './gestionar-sesiones.component.html',
  styleUrls: ['./gestionar-sesiones.component.css']
})
export class GestionarSesionesComponent implements OnInit {
  sessionForm: FormGroup;
  sessions: Session[] = [];
  isEditing = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  private apiUrl = '/api/session';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.sessionForm = this.fb.group({
      id: [null],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      duracion: [0, [Validators.required, Validators.min(1)]],
      estado: ['Activa', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadSessions();
  }

  loadSessions(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.getSessions().subscribe({
      next: (response: any) => {
        console.log('Respuesta cruda:', response);
        this.sessions = Array.isArray(response) ? response : response.data || [];
        console.log('Sesiones cargadas:', this.sessions, 'Cantidad:', this.sessions.length);
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = this.handleError(error);
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.sessionForm.invalid) {
      this.sessionForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const sessionData = this.sessionForm.value;
    console.log('Datos enviados:', sessionData);

    const request = this.isEditing
      ? this.updateSession(sessionData.id, sessionData)
      : this.createSession(sessionData);

    request.subscribe({
      next: () => {
        this.successMessage = this.isEditing ? 'Sesión actualizada con éxito' : 'Sesión creada con éxito';
        this.isLoading = false;
        this.resetForm();
        this.loadSessions();
      },
      error: (error) => {
        this.errorMessage = this.handleError(error);
        this.isLoading = false;
      }
    });
  }

  editSession(session: Session): void {
    this.isEditing = true;
    this.sessionForm.patchValue(session);
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.resetForm();
  }

  deleteSession(id: number): void {
    if (!confirm('¿Estás seguro de eliminar esta sesión?')) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.deleteSessionRequest(id).subscribe({
      next: () => {
        this.successMessage = 'Sesión eliminada con éxito';
        this.isLoading = false;
        this.loadSessions();
      },
      error: (error) => {
        this.errorMessage = this.handleError(error);
        this.isLoading = false;
      }
    });
  }

  reloadSessions(): void {
    this.loadSessions();
  }

  trackBySessionId(index: number, session: Session): number {
    return session.id;
  }

  private getSessions(): Observable<any> {
    return this.http.get(this.apiUrl, this.getHttpOptions());
  }

  private createSession(session: Session): Observable<any> {
    return this.http.post(this.apiUrl, session, this.getHttpOptions());
  }

  private updateSession(id: number, session: Session): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, session, this.getHttpOptions());
  }

  private deleteSessionRequest(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.getHttpOptions());
  }

  private getHttpOptions() {
    const token = localStorage.getItem('token');
    console.log('Token enviado:', token); // Log para depurar
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : ''
      })
    };
  }

  private handleError(error: any): string {
    console.error('Error completo:', error);
    if (error.status === 401 || error.url?.includes('/auth/login')) {
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
      return 'Sesión expirada. Por favor, inicia sesión nuevamente.';
    }
    if (error.error instanceof SyntaxError && error.error.message.includes('JSON')) {
      return 'Error en la respuesta del servidor: se esperaba JSON, pero se recibió HTML.';
    }
    return error.error?.message || 'Ocurrió un error. Intenta de nuevo.';
  }

  private resetForm(): void {
    this.sessionForm.reset({
      id: null,
      nombre: '',
      fecha: '',
      hora: '',
      duracion: 0,
      estado: 'Activa'
    });
    this.isEditing = false;
  }
}