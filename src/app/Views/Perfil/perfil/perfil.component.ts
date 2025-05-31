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
  correo: string | null;
  nombres: string | null;
  apellidos: string | null;
  dni: string | null;
  celular: string | null;
  habilidades: string[] | null;
  rol: string;
  contrasena: string | null;
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
  availableSkills: string[] = ['Diseño', 'Habilidades blandas', 'Idiomas', 'Modelado Técnico', 'Ofimática', 'Programacion'];

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
    this.http.get<{ status: number; message: string; data: UserProfile[] }>(`${environment.apiUrlPerfil}/${userId}`).subscribe({
      next: (response) => {
        const userData = response.data && response.data.length > 0 ? response.data[0] : null;
        if (userData) {
          this.user = { ...userData, habilidades: userData.habilidades || [] };
          console.log('Contraseña cargada:', this.user.contrasena); // Verificar que contrasena se carga
        } else {
          this.errorMessage = 'No se encontraron datos del perfil';
        }
        this.isLoading = false;
        console.log('Perfil:', this.user);
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
      this.loadUserProfile(this.authService.getUserId()!);
    }
  }

  saveProfile() {
    if (this.user && this.authService.getUserId()) {
      if (!this.user.habilidades || this.user.habilidades.length < 1 || this.user.habilidades.length > 3) {
        this.errorMessage = 'Debes seleccionar entre 1 y 3 categorias';
        this.isLoading = false;
        return;
      }
      this.isLoading = true;
      const originalPassword = this.user.contrasena; // Guardar la contraseña original
      const userData = {
        correo: this.user.correo,
        nombres: this.user.nombres,
        apellidos: this.user.apellidos,
        dni: this.user.dni,
        celular: this.user.celular,
        habilidades: this.user.habilidades,
        rol: this.user.rol,
        contrasena: originalPassword // Usar la contraseña original
      };
      console.log('Datos enviados al guardar:', userData); // Verificar qué se envía
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

  addSkill(skill: string) {
    if (this.user && this.user.habilidades) {
      if (!this.user.habilidades.includes(skill) && this.user.habilidades.length < 3) {
        this.user.habilidades.push(skill);
      }
    } else if (this.user) {
      this.user.habilidades = [skill];
    }
  }

  removeSkill(skill: string) {
    if (this.user && this.user.habilidades) {
      this.user.habilidades = this.user.habilidades.filter(s => s !== skill);
    }
  }
}