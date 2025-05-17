import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

interface Worker {
  id: number;
  correo: string;
  contrasena?: string;
  nombres: string;
  apellidos: string;
  dni: string;
  celular: string;
  habilidades: string[];
  rol: string;
}

@Component({
  selector: 'app-gestionar-trabajadores',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './gestionar-trabajadores.component.html',
  styleUrls: ['./gestionar-trabajadores.component.css']
})
export class GestionarTrabajadoresComponent implements OnInit {
  private workersSubject = new BehaviorSubject<Worker[]>([]);
  workers$ = this.workersSubject.asObservable();
  workers: Worker[] = [];
  workerForm: FormGroup;
  isEditing = false;
  editingWorkerId: number | null = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isLoading = true;
  private isInitialLoad = true;

  private baseUrl = 'https://entrevistapro-back.onrender.com/api/user';
  private workersUrl = 'https://entrevistapro-back.onrender.com/api/user/workers';

  constructor(
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.workerForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.minLength(6)]],
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      celular: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      habilidades: ['', Validators.required],
      rol: ['Worker', Validators.required]
    });

    // Sincronizar workers con el BehaviorSubject
    this.workers$.subscribe(workers => {
      this.workers = workers;
    });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    });
  }

  ngOnInit() {
    this.loadWorkers();
  }

  trackByWorkerId(index: number, worker: Worker): number {
    return worker.id;
  }

  loadWorkers(retryCount = 0) {
    this.isLoading = true;
    this.http.get<{ status: number; message: string; data: Worker | Worker[] }>(this.workersUrl, { headers: this.getAuthHeaders() }).subscribe({
      next: (response) => {
        console.log('Respuesta cruda:', response);
        const data = Array.isArray(response.data) ? response.data : [response.data];
        // Ordenar por id ascendente
        data.sort((a, b) => a.id - b.id);
        this.workersSubject.next([...data]);
        console.log('Trabajadores cargados:', this.workers, 'Cantidad:', this.workers.length);
        this.isLoading = false;

        // Reintentar solo en carga inicial si la lista está vacía
        if (this.isInitialLoad && this.workers.length === 0 && retryCount < 3) {
          console.log(`Lista vacía en carga inicial, reintentando (${retryCount + 1}/3)...`);
          setTimeout(() => this.loadWorkers(retryCount + 1), 1500);
        } else {
          this.isInitialLoad = false;
        }
      },
      error: (error) => {
        this.errorMessage = this.handleError(error);
        this.isLoading = false;
        console.error('Error al cargar trabajadores:', error);

        // Reintentar en caso de error en carga inicial
        if (this.isInitialLoad && retryCount < 3) {
          console.log(`Error en carga inicial, reintentando (${retryCount + 1}/3)...`);
          setTimeout(() => this.loadWorkers(retryCount + 1), 1500);
        } else {
          this.isInitialLoad = false;
        }
      }
    });
  }

  onSubmit() {
    if (this.workerForm.valid) {
      const workerData = {
        ...this.workerForm.value,
        habilidades: this.workerForm.value.habilidades.split(',').map((h: string) => h.trim())
      };
      if (this.isEditing && this.editingWorkerId) {
        this.updateWorker(this.editingWorkerId, workerData);
      } else {
        this.createWorker(workerData);
      }
    } else {
      this.workerForm.markAllAsTouched();
    }
  }

  createWorker(workerData: any) {
    this.isLoading = true;
    this.http.post<{ status: number; message: string; data: Worker }>(this.baseUrl, workerData, { headers: this.getAuthHeaders() }).subscribe({
      next: (response) => {
        this.successMessage = 'Trabajador creado exitosamente';
        this.errorMessage = null;
        this.workerForm.reset({ rol: 'Worker' });
        this.loadWorkers();
      },
      error: (error) => {
        this.errorMessage = this.handleError(error);
        this.isLoading = false;
        console.error('Error al crear trabajador:', error);
      }
    });
  }

  updateWorker(workerId: number, workerData: any) {
    if (!workerData.contrasena) {
      delete workerData.contrasena;
    }
    this.isLoading = true;
    this.http.put<{ status: number; message: string; data: Worker }>(`${this.baseUrl}/${workerId}`, workerData, { headers: this.getAuthHeaders() }).subscribe({
      next: (response) => {
        this.successMessage = 'Trabajador actualizado exitosamente';
        this.errorMessage = null;
        this.workerForm.reset({ rol: 'Worker' });
        this.isEditing = false;
        this.editingWorkerId = null;
        this.loadWorkers();
      },
      error: (error) => {
        this.errorMessage = this.handleError(error);
        this.isLoading = false;
        console.error('Error al actualizar trabajador:', error);
      }
    });
  }

  editWorker(worker: Worker) {
    console.log('Editando trabajador:', worker);
    this.isEditing = true;
    this.editingWorkerId = worker.id;
    this.workerForm.patchValue({
      ...worker,
      habilidades: worker.habilidades.join(', '),
      contrasena: ''
    });
    this.workerForm.get('contrasena')?.clearValidators();
    this.workerForm.get('contrasena')?.updateValueAndValidity();
  }

  deleteWorker(workerId: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este trabajador?')) {
      this.isLoading = true;
      this.http.delete<{ status: number; message: string }>(`${this.baseUrl}/${workerId}`, { headers: this.getAuthHeaders() }).subscribe({
        next: () => {
          this.successMessage = 'Trabajador eliminado exitosamente';
          this.errorMessage = null;
          this.loadWorkers();
        },
        error: (error) => {
          this.errorMessage = this.handleError(error);
          this.isLoading = false;
          console.error('Error al eliminar trabajador:', error);
        }
      });
    }
  }

  cancelEdit() {
    this.isEditing = false;
    this.editingWorkerId = null;
    this.workerForm.reset({ rol: 'Worker' });
    this.workerForm.get('contrasena')?.setValidators([Validators.minLength(6)]);
    this.workerForm.get('contrasena')?.updateValueAndValidity();
  }

  reloadWorkers() {
    this.loadWorkers();
  }

  private handleError(error: any): string {
    switch (error.status) {
      case 400:
        return 'Datos inválidos. Por favor, revisa el formulario.';
      case 401:
        return 'No autorizado. Por favor, inicia sesión nuevamente.';
      case 403:
        return 'Acceso denegado. No tienes permisos para esta acción.';
      case 404:
        return 'Trabajador no encontrado.';
      case 500:
        return 'Error en el servidor. Intenta de nuevo más tarde.';
      default:
        return 'Ocurrió un error inesperado.';
    }
  }
}
