import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../Components/navbar/navbar.component';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../environments/environment';

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
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  user: UserProfile | null = null;
  isLoading = true;
  errorMessage: string | null = null;

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
    this.http.get<{ status: number; message: string; data: UserProfile }>(`${environment.apiUrl}/${userId}`).subscribe({
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
}
