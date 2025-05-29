import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../Components/navbar/navbar.component';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

interface UserProfile {
  id: number;
  correo: string;
  nombres: string;
  apellidos: string;
  dni: string;
  celular: string;
  habilidades: string[];
  rol: string;
}

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  user: UserProfile | null = null;
  isLoading = true;
  errorMessage: string | null = null;
  isEditing = false;

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    const userId = this.authService.getUserId();
    console.log('User ID:', userId);
    if (userId) {
      this.loadUserProfile(userId);
    } else {
      this.isLoading = false;
      this.errorMessage = 'No se encontró el ID del usuario';
    }
  }

  loadUserProfile(userId: number) {
    this.http.get<{ status: number; message: string; data: UserProfile }>(`${environment.apiUrlUser}/${userId}`).subscribe({
      next: (response) => {
        this.user = response.data;
        this.isLoading = false;
        console.log('Perfil:', response.data);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Error al cargar el perfil';
        console.error('Error:', error);
      }
    });
  }

  toggleEdit(edit: boolean) {
    this.isEditing = edit;
    if (!edit && this.user) {
      // Restaurar datos originales si se cancela
      this.loadUserProfile(this.authService.getUserId()!);
    }
  }

  saveProfile() {
    if (this.user && this.authService.getUserId()) {
      this.isLoading = true;
      const userData = {
        correo: this.user.correo,
        nombres: this.user.nombres,
        apellidos: this.user.apellidos,
        dni: this.user.dni,
        celular: this.user.celular,
        habilidades: this.user.habilidades,
        rol: this.user.rol
      };
      this.http.put(`${environment.apiUrlUser}/${this.authService.getUserId()}`, userData, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`
        })
      }).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.isEditing = false;
          console.log('Perfil actualizado:', response);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Error al guardar el perfil';
          console.error('Error:', error);
        }
      });
    }
  }
}