import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../../../Components/navbar/navbar.component';
import { CourseService } from '../../../services/course.service';
import Course from '../../../models/course';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detalle-curso',
  standalone: true,
  imports: [NavbarComponent, CommonModule],
  templateUrl: './detalle-curso.component.html',
  styleUrls: ['./detalle-curso.component.css']
})
export class DetalleCursoComponent {
  course: Course | null = null; // Property to store the course
  errorMessage: string | null = null; // For error handling
  isLoading: boolean = true; // To track loading state

  constructor(private service: CourseService, private route: ActivatedRoute) {
    this.loadCourse(this.route.snapshot.paramMap.get('id') || '');
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
}
