import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatInput } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../../Components/navbar/navbar.component";

export interface Sesion {
  id: number;
  usuario_id: number;
  profesional_id: number;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  estado: string;
  notas: string;
  created_at: string;
  enlace: string;
}

@Component({
  selector: 'app-mis-sesiones',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatFormFieldModule, MatInputModule, NavbarComponent],
  templateUrl: './mis-sesiones.component.html',
  styleUrls: ['./mis-sesiones.component.css']
})
export class MisSesionesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'usuario_id', 'profesional_id', 'fecha', 'hora_inicio', 'hora_fin', 'estado', 'notas', 'created_at','enlace'];
  dataSource = new MatTableDataSource<Sesion>();
  @ViewChild('input') input!: MatInput;

  ngOnInit() {
    const sesiones: Sesion[] = [
      { id: 1, usuario_id: 101, profesional_id: 201, fecha: '2025-05-16', hora_inicio: '14:00', hora_fin: '15:00', estado: 'Completada', notas: 'Buena sesión', created_at: '2025-05-15' , enlace:'http://'},
      { id: 2, usuario_id: 102, profesional_id: 202, fecha: '2025-05-17', hora_inicio: '10:00', hora_fin: '11:00', estado: 'Pendiente', notas: 'Preparar temas', created_at: '2025-05-15', enlace:'http://' },
    ];
    this.dataSource.data = sesiones;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getStatusClass(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'completada': return 'status-completed';
      case 'pendiente': return 'status-pending';
      default: return '';
    }
  }
}
