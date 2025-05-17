import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatInput } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../../Components/navbar/navbar.component";
import Session from '../../../models/sessions';
 ""
@Component({
  selector: 'app-mis-sesiones',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatFormFieldModule, MatInputModule, NavbarComponent],
  templateUrl: './mis-sesiones.component.html',
  styleUrls: ['./mis-sesiones.component.css']
})
export class MisSesionesComponent implements OnInit {

  dataSource = new MatTableDataSource<Session>();
  @ViewChild('input') input!: MatInput;

  ngOnInit() {
    const sesiones: Session[] = [
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
