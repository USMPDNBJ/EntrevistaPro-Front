import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';

interface Session {
  id: number;
  usuario_id: number;
  usuario_nombre?: string;
  profesional_id: number | null;
  profesional_nombre?: string;
  id_pago: number | null;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  estado: string;
  evaluacion: string | null;
  creado_en: string;
  enlace: string | null;
}

interface User {
  id: number;
  nombres: string;
  apellidos: string;
  rol: string;
}

@Component({
  selector: 'app-gestionar-sesiones',
  templateUrl: './gestionar-sesiones.component.html',
  imports: [CommonModule, ReactiveFormsModule],
  styleUrls: ['./gestionar-sesiones.component.css']
})
export class GestionarSesionesComponent implements OnInit {
  sessionForm: FormGroup;
  sessions: Session[] = [];
  users: User[] = [];
  workers: User[] = [];
  isEditing = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  private apiUrl = environment.apiUrlSession;
  private apiUrlUsers = environment.apiUrlUser;
  private workersUrl = `${environment.apiUrlUser}/workers`;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.sessionForm = this.fb.group({
      id: [null],
      usuario_id: ['', [Validators.required]], // Ahora será el ID seleccionado desde el combo box
      profesional_id: [null],
      id_pago: [null, Validators.min(1)],
      fecha: ['', Validators.required],
      hora_inicio: ['', Validators.required],
      hora_fin: ['', Validators.required],
      estado: ['Programada', Validators.required],
      enlace: ['']
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    forkJoin({
      users: this.getUsers(),
      workers: this.getWorkers(),
      sessions: this.getSessions()
    }).subscribe({
      next: ({ users, workers, sessions }) => {
        this.users = Array.isArray(users.data) ? users.data.filter((u: User) => u.rol === 'user') : [];
        this.workers = Array.isArray(workers.data) ? workers.data : [];
        const sessionsData = Array.isArray(sessions.data) ? sessions.data : sessions.data || [];
        console.log('Usuarios cargados:', this.users);
        console.log('Trabajadores cargados:', this.workers);
        console.log('Sesiones crudas:', sessionsData);
        this.sessions = sessionsData.map((session: Session) => {
          const user = this.users.find((u: User) => u.id === session.usuario_id);
          const worker = this.workers.find((w: User) => w.id === session.profesional_id);
          return {
            ...session,
            usuario_nombre: user ? `${user.nombres} ${user.apellidos}` : 'Usuario no encontrado',
            profesional_nombre: worker ? `${worker.nombres} ${worker.apellidos}` : '-'
          };
        });
        console.log('Sesiones cargadas:', this.sessions);
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
        this.loadData();
      },
      error: (error) => {
        this.errorMessage = this.handleError(error);
        this.isLoading = false;
      }
    });
  }

  editSession(session: Session): void {
    this.isEditing = true;
    this.sessionForm.patchValue({
      id: session.id,
      usuario_id: session.usuario_id,
      profesional_id: session.profesional_id,
      id_pago: session.id_pago,
      fecha: session.fecha,
      hora_inicio: session.hora_inicio,
      hora_fin: session.hora_fin,
      estado: session.estado,
      enlace: session.enlace
    });
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
        this.loadData();
      },
      error: (error) => {
        this.errorMessage = this.handleError(error);
        this.isLoading = false;
      }
    });
  }

  reloadSessions(): void {
    this.loadData();
  }

  trackBySessionId(index: number, session: Session): number {
    return session.id;
  }

  private getSessions(): Observable<any> {
    return this.http.get(this.apiUrl, this.getHttpOptions());
  }

  private getUsers(): Observable<any> {
    return this.http.get(this.apiUrlUsers, this.getHttpOptions());
  }

  private getWorkers(): Observable<any> {
    return this.http.get(this.workersUrl, this.getHttpOptions());
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
      usuario_id: '',
      profesional_id: null,
      id_pago: null,
      fecha: '',
      hora_inicio: '',
      hora_fin: '',
      estado: 'Programada',
      enlace: ''
    });
    this.isEditing = false;
  }
}