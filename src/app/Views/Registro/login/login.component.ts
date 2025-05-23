import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginGroup: FormGroup;
  isLoading = false;
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

  ngOnInit() {}

  onSubmit() {
    if (this.loginGroup.valid) {
      this.isLoading = true;
      this.errorMessage = null;
      this.successMessage = null;

      const credentials = this.loginGroup.value;
      this.authService.login(credentials).subscribe({
        next: (response) => {
          this.isLoading = false;
          const userId = response.data.id;
          const rol = response.data.rol.toLowerCase();
          console.log('Login - userId:', userId, 'rol:', rol);
          if (userId && rol) {
            this.successMessage = 'Inicio de sesión exitoso';
            sessionStorage.setItem('user',JSON.stringify(userId))
            this.router.navigate(['/home']);
          } else {
            this.errorMessage = 'Error: Respuesta inválida';
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Credenciales inválidas';
          console.error('Login error:', error);
        }
      });
    } else {
      this.loginGroup.markAllAsTouched();
    }
  }
}
