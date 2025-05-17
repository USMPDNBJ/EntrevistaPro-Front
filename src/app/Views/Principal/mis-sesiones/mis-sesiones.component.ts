import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatInput } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../../Components/navbar/navbar.component";
import Session from '../../../models/sessions';
import { UserService } from '../../../services/session.service';

@Component({
  selector: 'app-mis-sesiones',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    NavbarComponent
  ],
  templateUrl: './mis-sesiones.component.html',
  styleUrls: ['./mis-sesiones.component.css']
})
export class MisSesionesComponent implements OnInit {
  sesiones: any[] = [];
  dataSource = new MatTableDataSource<Session>();
  displayedColumns: string[] = [
    'id', 'trabajador', 'fecha', 'hora_inicio', 'hora_fin', 'estado', 'evaluacion', 'creado en', 'enlace'
  ];
  @ViewChild('input') input!: MatInput;
  userId: string;

  constructor(private userService: UserService) {
    // Obtener el userId del localStorage
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      this.userId = storedUserId;  // Si existe, lo usamos
    } else {
      console.error('No se encontró el userId en localStorage');
      this.userId = '';  // Manejo de error si no existe en localStorage
    }
  }

  ngOnInit() {
    if (this.userId) {
      this.loadSessions();
    } else {
      // Aquí podrías manejar la situación si no hay userId, por ejemplo, redirigir al login
      console.log('No se pudo cargar las sesiones: userId no disponible');
    }
  }

  loadSessions() {
    this.userService.getSessionsByUserId(this.userId).subscribe(
      (response: any) => {
        console.log('Respuesta completa del servidor:', response);
        console.log('Respuesta keys:', Object.keys(response));

        if (response) {
          this.sesiones = [response];
          this.dataSource.data = this.sesiones;
          console.log('Sesiones asignadas a dataSource:', this.dataSource.data);
        } else {
          console.error('Error: La respuesta está vacía o mal formada');
        }
      },
      (error) => {
        console.error('Error al cargar las sesiones:', error);
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getStatusClass(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'completada': return 'status-completed';
      case 'pendiente': return 'status-pending';
      case 'reprogramada': return 'status-reprogramada';
      default: return '';
    }
  }
}
