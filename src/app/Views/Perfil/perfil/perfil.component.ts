import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../Components/navbar/navbar.component';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { PerfilService } from '../../../services/perfil.service';
import { AuthService } from '../../../services/auth.service';

interface User {
  id: number;
  correo: string;
  nombres: string;
  apellidos: string;
  dni: string;
  celular: string;
  habilidades: string[];
}

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterLink],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  user: User | null = null;
  isLoading: boolean = false;
  errorMessage: string | null = null;
  private userIdSubscription?: Subscription;

  constructor(
    private perfilService: PerfilService,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    console.log('PerfilComponent constructor');
  }

  ngOnInit() {
    console.log('PerfilComponent ngOnInit');
    this.loadUser();
  }

  loadUser() {
    console.log('loadUser called');
    if (!isPlatformBrowser(this.platformId)) {
      this.errorMessage = 'No se puede cargar el perfil en este entorno.';
      console.warn('SSR environment detected');
      return;
    }

    // Subscribe to userId$ for reactivity
    this.userIdSubscription = this.authService.userId$.subscribe(userId => {
      console.log('userId$ emitted:', userId);
      if (!userId) {
        this.errorMessage = 'No se encontró información del usuario. Por favor, inicia sesión.';
        console.warn('No user ID available');
        // Fallback for testing
        // userId = 4;
        return;
      }

      this.isLoading = true;
      this.perfilService.getUser(userId).subscribe({
        next: (response) => {
          console.log('PerfilService response:', response);
          this.isLoading = false;
          this.user = response.data;
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error fetching user:', error);
          if (error.status === 404) {
            this.errorMessage = 'Usuario no encontrado.';
          } else {
            this.errorMessage = `Error: ${error.status} - ${error.message}`;
          }
        }
      });
    });
  }

  ngOnDestroy() {
    if (this.userIdSubscription) {
      this.userIdSubscription.unsubscribe();
    }
  }
}
