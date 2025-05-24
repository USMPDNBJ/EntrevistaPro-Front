import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray, FormControl, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../../environments/environment';

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

  habilidadesDisponibles = [
    'Comunicación',
    'Trabajo en equipo',
    'Resolución de problemas',
    'Adaptabilidad',
    'Liderazgo',
    'Gestión del tiempo'
  ];

  private baseUrl = environment.apiUrlUser;
  private workersUrl = `${environment.apiUrlUser}/workers`;

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
      habilidades: this.fb.array(
        this.habilidadesDisponibles.map(() => this.fb.control(false)),
        this.minSelectedCheckboxes(1, 3)
      ),
      rol: ['Worker', Validators.required]
    });

    this.workers$.subscribe(workers => {
      this.workers = workers;
    });
  }

  get habilidadesFormArray(): FormArray {
    return this.workerForm.get('habilidades') as FormArray;
  }

  minSelectedCheckboxes(min: number, max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formArray = control as FormArray;
      const totalSelected = formArray.controls.filter(ctrl => ctrl.value).length;
      if (totalSelected < min) return { ['required']: true };
      if (totalSelected > max) return { ['maxSelected']: true };
      return null;
    };
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
        data.sort((a, b) => a.id - b.id);
        this.workersSubject.next([...data]);
        console.log('Trabajadores cargados:', this.workers, 'Cantidad:', this.workers.length);
        this.isLoading = false;

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
      const selectedHabilidades = this.habilidadesFormArray.controls
        .map((control, i) => control.value ? this.habilidadesDisponibles[i] : null)
        .filter(habilidad => habilidad !== null) as string[];

      const workerData = {
        ...this.workerForm.value,
        habilidades: selectedHabilidades
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
        this.workerForm.reset({ rol: 'Worker', habilidades: this.habilidadesDisponibles.map(() => false) });
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
        this.workerForm.reset({ rol: 'Worker', habilidades: this.habilidadesDisponibles.map(() => false) });
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

    const habilidadesControls = this.habilidadesDisponibles.map(habilidad =>
      worker.habilidades.includes(habilidad)
    );
    this.habilidadesFormArray.clear();
    habilidadesControls.forEach(value => this.habilidadesFormArray.push(this.fb.control(value)));

    this.workerForm.patchValue({
      ...worker,
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
    this.workerForm.reset({ rol: 'Worker', habilidades: this.habilidadesDisponibles.map(() => false) });
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