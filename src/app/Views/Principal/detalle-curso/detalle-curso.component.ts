import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../Components/navbar/navbar.component';
import { CourseService } from '../../../services/course.service';
import Course from '../../../models/course';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detalle-curso',
  standalone: true,
  imports: [NavbarComponent, CommonModule, RouterLink],
  templateUrl: './detalle-curso.component.html',
  styleUrls: ['./detalle-curso.component.css']
})
export class DetalleCursoComponent {
  course: Course | null = null; // Property to store the course
  errorMessage: string | null = null; // For error handling
  isLoading: boolean = true; // To track loading state
  cursoId: string | null = null; // To store the course ID
  constructor(private service: CourseService, private route: ActivatedRoute) {
    this.cursoId = this.route.snapshot.paramMap.get('id'); // Get course ID from route
    if (this.cursoId) {
      this.loadCourse(this.cursoId); // Load course details
    } else {
      this.errorMessage = 'Curso no encontrado.';
      this.isLoading = false; // Clear loading state
    }
  }

  loadCourse(id: string) {
    this.isLoading = true; // Set loading state
    this.service.getCoursesByCourseId(id).subscribe({
      next: (course: Course) => {
        this.course = course; // Assign fetched course
        this.isLoading = false; // Clear loading state
        console.log('Curso obtenido:', course);
      },
      error: (error) => {
        this.errorMessage = 'No se pudo cargar el curso. Por favor, intenta de nuevo más tarde.';
        this.isLoading = false; // Clear loading state
        console.error('Error al obtener el curso:', error);
      }
    });
  }
  scheduleCourse() {

    if (this.course) {
      console.log('Curso id:', this.course.id_course);
      if (this.course.id_course) {
        sessionStorage.setItem('courseId', this.course.id_course.toString());
      }
      sessionStorage.setItem('precio', this.course.precio.toString());
      sessionStorage.setItem('pasarela', 'course');
    } else {
      this.errorMessage = 'No se pudo programar el curso. Por favor, intenta de nuevo más tarde.';
    }
  }
}
