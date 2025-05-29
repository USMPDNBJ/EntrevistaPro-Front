import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray, FormControl, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../../environments/environment';

interface User {
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
  selector: 'app-gestionar-usuarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './gestionar-usuarios.component.html',
  styleUrls: ['./gestionar-usuarios.component.css']
})
export class GestionarUsuariosComponent implements OnInit {
  private usersSubject = new BehaviorSubject<User[]>([]);
  users$ = this.usersSubject.asObservable();
  users: User[] = [];
  userForm: FormGroup;
  isEditing = false;
  editingUserId: number | null = null;
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

  constructor(
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group({
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

    this.users$.subscribe(users => {
      this.users = users;
    });
  }

  get habilidadesFormArray(): FormArray {
    return this.userForm.get('habilidades') as FormArray;
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
    this.loadUsers();
  }

  trackByUserId(index: number, user: User): number {
    return user.id;
  }

  loadUsers(retryCount = 0) {
    this.isLoading = true;
    this.http.get<{ status: number; message: string; data: User | User[] }>(this.baseUrl, { headers: this.getAuthHeaders() }).subscribe({
      next: (response) => {
        console.log('Respuesta cruda:', response);
        const data = Array.isArray(response.data) ? response.data : [response.data];
        data.sort((a, b) => a.id - b.id);
        this.usersSubject.next([...data]);
        console.log('Usuarios cargados:', this.users, 'Cantidad:', this.users.length);
        this.isLoading = false;

        if (this.isInitialLoad && this.users.length === 0 && retryCount < 3) {
          console.log(`Lista vacía en carga inicial, reintentando (${retryCount + 1}/3)...`);
          setTimeout(() => this.loadUsers(retryCount + 1), 1500);
        } else {
          this.isInitialLoad = false;
        }
      },
      error: (error) => {
        this.errorMessage = this.handleError(error);
        this.isLoading = false;
        console.error('Error al cargar usuarios:', error);

        if (this.isInitialLoad && retryCount < 3) {
          console.log(`Error en carga inicial, reintentando (${retryCount + 1}/3)...`);
          setTimeout(() => this.loadUsers(retryCount + 1), 1500);
        } else {
          this.isInitialLoad = false;
        }
      }
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      const selectedHabilidades = this.habilidadesFormArray.controls
        .map((control, i) => control.value ? this.habilidadesDisponibles[i] : null)
        .filter(habilidad => habilidad !== null) as string[];

      const userData = {
        ...this.userForm.value,
        habilidades: selectedHabilidades
      };

      if (this.isEditing && this.editingUserId) {
        this.updateUser(this.editingUserId, userData);
      } else {
        this.createUser(userData);
      }
    } else {
      this.userForm.markAllAsTouched();
    }
  }

  createUser(userData: any) {
    this.isLoading = true;
    this.http.post<{ status: number; message: string; data: User }>(this.baseUrl, userData, { headers: this.getAuthHeaders() }).subscribe({
      next: (response) => {
        this.successMessage = 'Usuario creado exitosamente';
        this.errorMessage = null;
        this.userForm.reset({ rol: 'Worker', habilidades: this.habilidadesDisponibles.map(() => false) });
        this.loadUsers();
      },
      error: (error) => {
        this.errorMessage = this.handleError(error);
        this.isLoading = false;
        console.error('Error al crear usuario:', error);
      }
    });
  }

  updateUser(userId: number, userData: any) {
    if (!userData.contrasena) {
      delete userData.contrasena;
    }
    this.isLoading = true;
    this.http.put<{ status: number; message: string; data: User }>(`${this.baseUrl}/${userId}`, userData, { headers: this.getAuthHeaders() }).subscribe({
      next: (response) => {
        this.successMessage = 'Usuario actualizado exitosamente';
        this.errorMessage = null;
        this.userForm.reset({ rol: 'Worker', habilidades: this.habilidadesDisponibles.map(() => false) });
        this.isEditing = false;
        this.editingUserId = null;
        this.loadUsers();
      },
      error: (error) => {
        this.errorMessage = this.handleError(error);
        this.isLoading = false;
        console.error('Error al actualizar usuario:', error);
      }
    });
  }

  editUser(user: User) {
    console.log('Editando usuario:', user);
    this.isEditing = true;
    this.editingUserId = user.id;

    const habilidadesControls = this.habilidadesDisponibles.map(habilidad =>
      user.habilidades.includes(habilidad)
    );
    this.habilidadesFormArray.clear();
    habilidadesControls.forEach(value => this.habilidadesFormArray.push(this.fb.control(value)));

    this.userForm.patchValue({
      ...user,
      contrasena: ''
    });
    this.userForm.get('contrasena')?.clearValidators();
    this.userForm.get('contrasena')?.updateValueAndValidity();
  }

  deleteUser(userId: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this.isLoading = true;
      this.http.delete<{ status: number; message: string }>(`${this.baseUrl}/${userId}`, { headers: this.getAuthHeaders() }).subscribe({
        next: () => {
          this.successMessage = 'Usuario eliminado exitosamente';
          this.errorMessage = null;
          this.loadUsers();
        },
        error: (error) => {
          this.errorMessage = this.handleError(error);
          this.isLoading = false;
          console.error('Error al eliminar usuario:', error);
        }
      });
    }
  }

  cancelEdit() {
    this.isEditing = false;
    this.editingUserId = null;
    this.userForm.reset({ rol: 'Worker', habilidades: this.habilidadesDisponibles.map(() => false) });
    this.userForm.get('contrasena')?.setValidators([Validators.minLength(6)]);
    this.userForm.get('contrasena')?.updateValueAndValidity();
  }

  reloadUsers() {
    this.loadUsers();
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
        return 'Usuario no encontrado.';
      case 500:
        return 'Error en el servidor. Intenta de nuevo más tarde.';
      default:
        return 'Ocurrió un error inesperado.';
    }
  }
}