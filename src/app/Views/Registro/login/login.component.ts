import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginGroup: FormGroup;
  isLoading: boolean = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginGroup = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginGroup.valid) {
      this.isLoading = true;
      this.successMessage = null;
      this.errorMessage = null;

      const credentials = this.loginGroup.value;
      this.authService.login(credentials).subscribe({
        next: (response) => {
          console.log('Login success:', response);
          console.log('User ID after login:', this.authService.getUserId());
          this.isLoading = false;
          this.successMessage = response.message;
          setTimeout(() => {
            console.log('Navigating to /perfil'); // Changed to /perfil for testing
            this.router.navigate(['/perfil']).then(() => {
              console.log('Navigation to /perfil completed');
            });
          }, 3000);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Login error:', error);
          if (error.status === 401) {
            this.errorMessage = 'Correo o contraseña incorrectos.';
          } else {
            this.errorMessage = `Error: ${error.status} - ${error.message}`;
          }
        }
      });
    } else {
      this.errorMessage = 'Por favor, completa todos los campos correctamente.';
    }
  }
}
