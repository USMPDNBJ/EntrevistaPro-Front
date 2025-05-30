import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatInput } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../../Components/navbar/navbar.component";
import { CourseService } from '../../../services/course.service';
import Course from '../../../models/course';

@Component({
  selector: 'app-mis-myCourses',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    NavbarComponent
  ],
  templateUrl: './mis-cursos.component.html',
  styleUrls: ['./mis-cursos.component.css']
})
export class MisCursosComponent implements OnInit {
  myCourses: Course[] = [];
  dataSource = new MatTableDataSource<Course>([]);
  displayedColumns: string[] = [
    'nombre', 'categoria', 'profesional', 'duracion', 'horario', 'fecha_inicio', 'url'
  ];
  @ViewChild('input') input!: MatInput;
  userId: string;

  constructor(private courseService: CourseService) {
    const storedUserId = sessionStorage.getItem('userId');
    if (storedUserId) {
      this.userId = storedUserId;
    } else {
      console.error('No se encontró el userId en localStorage');
      this.userId = '';
    }
  }

  ngOnInit() {
    if (this.userId) {
      this.loadSessions(this.userId);
    } else {
      console.log('No se pudo cargar las myCourses: userId no disponible');
    }
  }

  loadSessions(userId: string) {
    this.courseService.getCoursesRegisteredId(userId).subscribe(
      (response: any) => {
        if (response) {
        this.myCourses = Array.isArray(response) ? response : [response];
          this.dataSource.data = this.myCourses;
          console.log(this.dataSource.data);
        } else {
          console.error('Error: La respuesta está vacía o mal formada');
        }
      },
      (error) => {
        console.error('Error al cargar las myCourses:', error);
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();

    // Aquí se define un filtro personalizado para varias columnas
    this.dataSource.filter = filterValue;  // Actualiza el filtro global de la tabla

    // Sobrescribimos el comportamiento por defecto del filtro
    this.dataSource.filterPredicate = (data: Course, filter: string) => {
      const strData = `${data.nombre} ${data.profesional} ${data.fecha_inicio} ${data.categoria}`.toLowerCase();
      return strData.includes(filter); // Busca en estos campos
    };
  }
}
