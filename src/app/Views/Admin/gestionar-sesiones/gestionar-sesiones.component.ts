import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

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
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestionar-sesiones.component.html',
  styleUrls: ['./gestionar-sesiones.component.css']
})
export class GestionarSesionesComponent implements OnInit {
  sessions: Session[] = [];
  workers: User[] = [];
  allUsers: User[] = [];
  isLoading = false;
  errorMessage = '';
  selectedSessionId: number | null = null;
  selectedWorkerId: number | null = null;
  showAssignModal = false;

  private apiUrl = environment.apiUrlSession;
  private apiUrlUsers = environment.apiUrlUser;
  private workersUrl = `${environment.apiUrlUser}/workers`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadSessionsAndWorkers();
  }

  loadSessionsAndWorkers(): void {
    this.isLoading = true;
    this.errorMessage = '';
    forkJoin({
      sessions: this.getSessions(),
      workers: this.getWorkers(),
      users: this.getAllUsers()
    }).subscribe({
      next: ({ sessions, workers, users }) => {
        console.log('Sessions received:', sessions);
        console.log('Workers received:', workers);
        console.log('All users received:', users);
        const sessionsData = Array.isArray(sessions) ? sessions : sessions.data || [];
        const workersData = Array.isArray(workers.data) ? workers.data : workers.data || [];
        const usersData = Array.isArray(users.data) ? users.data : users.data || [];
        this.sessions = sessionsData.map((session: Session) => ({
          ...session,
          usuario_nombre: this.getUserName(usersData, session.usuario_id),
          profesional_nombre: session.profesional_id ? this.getUserName(usersData, session.profesional_id) : '-'
        }));
        this.workers = workersData;
        this.allUsers = usersData;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = this.handleError(error);
        this.isLoading = false;
      }
    });
  }

  getUserName(users: User[], id: number): string {
    const user = users.find(u => u.id === id);
    return user ? `${user.nombres} ${user.apellidos}` : 'No encontrado';
  }

  reloadSessions(): void {
    this.loadSessionsAndWorkers();
  }

  trackBySessionId(index: number, session: Session): number {
    return session.id;
  }

  openAssignModal(sessionId: number) {
    this.selectedSessionId = sessionId;
    this.selectedWorkerId = null;
    this.showAssignModal = true;
  }

  closeModal(event: MouseEvent) {
    event.stopPropagation();
    this.showAssignModal = false;
  }

  saveAssignment() {
    if (this.selectedSessionId && this.selectedWorkerId) {
      this.isLoading = true;
      const session = this.sessions.find(s => s.id === this.selectedSessionId);
      if (!session) {
        this.errorMessage = 'Sesión no encontrada';
        this.isLoading = false;
        return;
      }
      const sessionData = {
        usuario_id: session.usuario_id,
        profesional_id: this.selectedWorkerId,
        id_pago: session.id_pago,
        fecha: session.fecha,
        hora_inicio: session.hora_inicio,
        hora_fin: session.hora_fin,
        estado: session.estado,
        evaluacion: session.evaluacion,
        enlace: session.enlace
      };
      console.log('Sending PUT request to:', `${this.apiUrl}/${this.selectedSessionId}`, 'with data:', sessionData);
      this.http.put(`${this.apiUrl}/${this.selectedSessionId}`, sessionData, this.getHttpOptions()).subscribe({
        next: (response) => {
          console.log('PUT response:', response);
          this.loadSessionsAndWorkers();
          this.showAssignModal = false;
        },
        error: (error) => {
          console.error('PUT error:', error);
          this.errorMessage = this.handleError(error);
          this.isLoading = false;
        }
      });
    }
  }

  private getSessions(): Observable<any> {
    return this.http.get(this.apiUrl, this.getHttpOptions());
  }

  private getWorkers(): Observable<any> {
    return this.http.get(this.workersUrl, this.getHttpOptions());
  }

  private getAllUsers(): Observable<any> {
    return this.http.get(this.apiUrlUsers, this.getHttpOptions());
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
    if (error.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
      return 'Sesión expirada. Por favor, inicia sesión nuevamente.';
    }
    return error.status ? `Error ${error.status}: ${error.error?.message || 'Algo salió mal'}` : 'Ocurrió un error. Intenta de nuevo.';
  }
}