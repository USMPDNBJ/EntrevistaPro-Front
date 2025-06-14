import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment.prod';

interface Course {
  id_course: number;
  nombre: string;
  descripcion: string;
  profesional: string;
  duracion: string;
  horario: string;
  precio: number;
  url: string;
  descripcion2: string | null;
  categoria: string | null;
  etapas: string[] | null;
  fecha_inicio: string | null;
  imagen: string | null;
}

@Component({
  selector: 'app-gestionar-cursos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestionar-cursos.component.html',
  styleUrls: ['./gestionar-cursos.component.css']
})
export class GestionarCursosComponent implements OnInit {
  courses: Course[] = [];
  newCourse: Course = {
    id_course: 0,
    nombre: '',
    descripcion: '',
    profesional: '',
    duracion: '',
    horario: '',
    precio: 0,
    url: '',
    descripcion2: '',
    categoria: '',
    etapas: [], // Inicializado como array vacío
    fecha_inicio: '',
    imagen: ''
  };
  editingCourse: Course | null = null;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  apiUrlCourse = environment.apiUrlCourse;
  categories = ['Programación', 'Diseño', 'Idiomas', 'Ofimática', 'Liderazgo'];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.isLoading = true;
    this.http.get<{ status: number; message: string; data: Course[] }>(this.apiUrlCourse, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`
      })
    }).subscribe({
      next: (response) => {
        this.courses = (response.data || []).map(course => {
          if (!course.id_course && course.id_course !== 0) {
            console.error('Curso sin id_course encontrado:', course);
            return { ...course, id_course: -1 }; // Asignar un valor temporal para identificar el problema
          }
          return course;
        });
        console.log('Cursos cargados:', this.courses);
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.errorMessage = 'Error al cargar los cursos: ' + (error.error?.message || error.message || 'Endpoint no encontrado');
        console.error('Error al cargar:', error);
      }
    });
  }

  startEditing(course: Course) {
    if (!course.id_course && course.id_course !== 0) {
      console.error('Intentando editar curso con id_course inválido:', course);
      this.errorMessage = 'No se puede editar un curso sin ID válido';
      return;
    }
    this.editingCourse = { ...course, etapas: [...(course.etapas || [])] }; // Copia profunda de etapas y preservar id_course
    console.log('Iniciando edición para curso con id:', this.editingCourse.id_course);
  }

  cancelEditing() {
    this.editingCourse = null;
    this.newCourse = {
      id_course: 0,
      nombre: '',
      descripcion: '',
      profesional: '',
      duracion: '',
      horario: '',
      precio: 0,
      url: '',
      descripcion2: '',
      categoria: '',
      etapas: [], // Reiniciar como array vacío
      fecha_inicio: '',
      imagen: ''
    };
    this.errorMessage = null;
  }

  addEtapa(etapa: string) {
    if (etapa && etapa.trim().length > 0) { // Validar que no sea cadena vacía
      if (this.editingCourse) {
        const etapas = this.editingCourse.etapas || [];
        if (!etapas.includes(etapa) && etapas.length < 5) {
          this.editingCourse.etapas = [...etapas, etapa];
        }
      } else {
        const etapas = this.newCourse.etapas || [];
        if (!etapas.includes(etapa) && etapas.length < 5) {
          this.newCourse.etapas = [...etapas, etapa];
        }
      }
    }
  }

  removeEtapa(etapa: string) {
    if (this.editingCourse && this.editingCourse.etapas) {
      this.editingCourse.etapas = this.editingCourse.etapas.filter(e => e !== etapa);
    } else if (this.newCourse.etapas) {
      this.newCourse.etapas = this.newCourse.etapas.filter(e => e !== etapa);
    }
  }

  saveCourse() {
    if (!this.validateCourse()) return;

    this.isLoading = true;
    const courseToSave = this.editingCourse || this.newCourse;
    const method = this.editingCourse ? 'put' : 'post';
    const url = this.editingCourse ? `${this.apiUrlCourse}/${courseToSave.id_course}` : this.apiUrlCourse;

    if (this.editingCourse && (!courseToSave.id_course || courseToSave.id_course < 0)) {
      this.errorMessage = 'Error: ID del curso no válido para actualizar';
      this.isLoading = false;
      return;
    }

    const fullCourse = {
      ...courseToSave,
      descripcion2: courseToSave.descripcion2 || '',
      categoria: courseToSave.categoria || '',
      etapas: courseToSave.etapas || [], // Asegurar que sea un array
      fecha_inicio: courseToSave.fecha_inicio || '',
      imagen: courseToSave.imagen || ''
    };

    console.log('Solicitud enviada a:', url);
    console.log('Datos enviados al backend:', fullCourse);

    this.http[method](url, fullCourse, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`
      })
    }).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.successMessage = this.editingCourse ? 'Curso actualizado con éxito' : 'Curso creado con éxito';
        this.editingCourse = null;
        this.newCourse = {
          id_course: 0,
          nombre: '',
          descripcion: '',
          profesional: '',
          duracion: '',
          horario: '',
          precio: 0,
          url: '',
          descripcion2: '',
          categoria: '',
          etapas: [],
          fecha_inicio: '',
          imagen: ''
        };
        this.loadCourses();
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.errorMessage = 'Error al guardar el curso: ' + (error.error?.message || error.message || 'Endpoint no encontrado');
        console.error('Error al guardar:', error, 'Respuesta:', error.error);
      }
    });
  }

  deleteCourse(id: number) {
    if (!confirm('¿Estás seguro de eliminar este curso?')) return;

    this.isLoading = true;
    this.http.delete<{ status: number; message: string }>(`${this.apiUrlCourse}/${id}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`
      })
    }).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = 'Curso eliminado con éxito';
        this.loadCourses();
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.errorMessage = 'Error al eliminar el curso: ' + (error.error?.message || error.message || 'Endpoint no encontrado');
        console.error('Error al eliminar:', error);
      }
    });
  }

  validateCourse(): boolean {
    const course = this.editingCourse || this.newCourse;
    if (!course.nombre || !course.descripcion || !course.profesional || !course.duracion || !course.horario || course.precio <= 0 || !course.url ||
        !course.descripcion2 || !course.categoria || !course.etapas || !course.etapas.length || !course.fecha_inicio || !course.imagen) {
      this.errorMessage = 'Por favor, completa todos los campos correctamente, incluyendo al menos una etapa';
      return false;
    }
    return true;
  }
}