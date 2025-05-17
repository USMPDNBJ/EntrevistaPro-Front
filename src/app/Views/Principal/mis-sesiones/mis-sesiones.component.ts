import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatInput } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../../Components/navbar/navbar.component";
import Session from '../../../models/sessions';
import { SessionService } from '../../../services/session.service';

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
  sesiones: Session[] = [];
  dataSource = new MatTableDataSource<Session>([]);
  displayedColumns: string[] = [
    'id', 'trabajador', 'fecha', 'hora_inicio', 'hora_fin', 'estado', 'evaluacion', 'creado en', 'enlace'
  ];
  @ViewChild('input') input!: MatInput;
  userId: string;

  constructor(private userService: SessionService) {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      this.userId = storedUserId;
    } else {
      console.error('No se encontró el userId en localStorage');
      this.userId = '';
    }
  }

  ngOnInit() {
    if (this.userId) {
      this.loadSessions();
    } else {
      console.log('No se pudo cargar las sesiones: userId no disponible');
    }
  }

  loadSessions() {
    this.userService.getSessionsByUserId(this.userId).subscribe(
      (response: any) => {
        if (response) {
        this.sesiones = Array.isArray(response) ? response : [response];
          this.dataSource.data = this.sesiones;
          console.log(this.dataSource.data);
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
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();

    // Aquí se define un filtro personalizado para varias columnas
    this.dataSource.filter = filterValue;  // Actualiza el filtro global de la tabla

    // Sobrescribimos el comportamiento por defecto del filtro
    this.dataSource.filterPredicate = (data: Session, filter: string) => {
      const strData = `${data.id} ${data.trabajador} ${data.fecha} ${data.estado}`.toLowerCase();
      return strData.includes(filter); // Busca en estos campos
    };
  }

  getStatusClass(estado?: string): string {
    if (!estado) return '';

    switch (estado.toLowerCase()) {
      case 'completada': return 'status-completed';
      case 'pendiente': return 'status-pending';
      case 'reprogramada': return 'status-reprogramada';
      default: return '';
    }
  }
}
