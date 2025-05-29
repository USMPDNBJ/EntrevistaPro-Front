import { Component } from '@angular/core';
import { FooterComponent } from "../../../Components/footer/footer.component";
import { NavbarComponent } from "../../../Components/navbar/navbar.component";
import Course from '../../../models/course';
import { CourseService } from '../../../services/course.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cursos',
  imports: [ NavbarComponent, CommonModule, RouterLink],
  templateUrl: './cursos.component.html',
  styleUrl: './cursos.component.css'
})
export class CursosComponent{
  courses: Course[] = [];
  loading: boolean = true;

  constructor(private courseService: CourseService) {
    this.loadCourses();
  }

  loadCourses() {
    this.courseService.getCourses().subscribe({
      next: (data) => {
        this.courses = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar los cursos:', error);
        this.loading = false;
      }
    });
  }

}
