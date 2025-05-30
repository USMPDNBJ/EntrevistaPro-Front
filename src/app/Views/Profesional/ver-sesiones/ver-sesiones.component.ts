import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
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
  selector: 'app-ver-sesiones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ver-sesiones.component.html',
  styleUrls: ['./ver-sesiones.component.css']
})
export class VerSesionesComponent implements OnInit {
  sessions: Session[] = [];
  isLoading = false;
  errorMessage = '';
  showEditModal = false;
  selectedSession: Session | null = null;
  selectedStatus: string | null = null;
  selectedLink: string | null = null;
  selectedEvaluation: string | null = null;

  private apiUrl = environment.apiUrlSession;
  private apiUrlUsers = environment.apiUrlUser;
  private apiUrlSession = environment.apiUrlSession;
  private workersUrl = environment.apiUrlWorker;

  constructor(private http: HttpClient, private AuthService: AuthService) {}

  ngOnInit(): void {
    this.loadSessions();
  }

  loadSessions(): void {
    this.isLoading = true;
    this.errorMessage = '';
    const profesionalId = this.AuthService.getUserId();
    if (!profesionalId) {
      this.errorMessage = 'No se encontró el ID del profesional';
      this.isLoading = false;
      return;
    }

    this.getSessions().subscribe({
      next: (response: any) => {
        console.log('Respuesta cruda sesiones:', response);
        const sessionsData = Array.isArray(response) ? response : response.data || [];
        const filteredSessions = sessionsData.filter((session: Session) => session.profesional_id === profesionalId);
        console.log('Sesiones filtradas:', filteredSessions);
        forkJoin({
          users: this.getUsers(),
          workers: this.getWorkers()
        }).subscribe({
          next: ({ users, workers }) => {
            console.log('Respuesta cruda usuarios:', users);
            console.log('Respuesta cruda trabajadores:', workers);
            const usersList = Array.isArray(users.data) ? users.data : users.data || [];
            const workersList = Array.isArray(workers.data) ? workers.data : workers.data || [];
            console.log('Usuarios procesados:', usersList);
            console.log('Trabajadores procesados:', workersList);
            this.sessions = filteredSessions.map((session: Session) => {
              const user = usersList.find((u: User) => u.id === session.usuario_id);
              const worker = workersList.find((w: User) => w.id === session.profesional_id);
              console.log(`Mapeando sesión ${session.id}: usuario_id ${session.usuario_id} -> ${user ? `${user.nombres} ${user.apellidos}` : 'No encontrado'}, profesional_id ${session.profesional_id} -> ${worker ? `${worker.nombres} ${worker.apellidos}` : 'No encontrado'}`);
              return {
                ...session,
                usuario_nombre: user ? `${user.nombres} ${user.apellidos}` : 'Usuario no encontrado',
                profesional_nombre: worker ? `${worker.nombres} ${worker.apellidos}` : '-'
              };
            });
            console.log('Sesiones cargadas:', this.sessions, 'Cantidad:', this.sessions.length);
            this.isLoading = false;
          },
          error: (error) => {
            this.errorMessage = this.handleError(error);
            this.isLoading = false;
          }
        });
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

  openEditModal(session: Session) {
    this.selectedSession = session;
    this.selectedStatus = session.estado;
    this.selectedLink = session.enlace;
    this.selectedEvaluation = session.evaluacion;
    this.showEditModal = true;
  }

  closeModal(event: MouseEvent) {
    event.stopPropagation();
    this.showEditModal = false;
    this.selectedSession = null;
    this.selectedStatus = null;
    this.selectedLink = null;
    this.selectedEvaluation = null;
  }

  saveChanges() {
    if (this.selectedSession && this.selectedStatus) {
      this.isLoading = true;
      const sessionData = {
        usuario_id: this.selectedSession.usuario_id,
        profesional_id: this.selectedSession.profesional_id,
        id_pago: this.selectedSession.id_pago,
        fecha: this.selectedSession.fecha,
        hora_inicio: this.selectedSession.hora_inicio,
        hora_fin: this.selectedSession.hora_fin,
        estado: this.selectedStatus,
        evaluacion: this.selectedEvaluation || null,
        enlace: this.selectedLink || null
      };
      console.log('Sending PUT request to:', `${this.apiUrl}/${this.selectedSession.id}`, 'with data:', sessionData);
      this.http.put(`${this.apiUrl}/${this.selectedSession.id}`, sessionData, this.getHttpOptions()).subscribe({
        next: (response) => {
          console.log('PUT response:', response);
          this.loadSessions();
          this.showEditModal = false;
          this.selectedSession = null;
          this.selectedStatus = null;
          this.selectedLink = null;
          this.selectedEvaluation = null;
        },
        error: (error) => {
          console.error('PUT error:', error);
          this.errorMessage = this.handleError(error);
          this.isLoading = false;
        }
      });
    }
  }

  copyLink(link: string) {
    navigator.clipboard.writeText(link).then(() => {
      alert('Enlace copiado al portapapeles');
    }).catch(err => {
      console.error('Error al copiar enlace:', err);
      this.errorMessage = 'Error al copiar el enlace';
    });
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

  private getHttpOptions() {
    const token = localStorage.getItem('token');
    console.log('Token enviado:', token);
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
}