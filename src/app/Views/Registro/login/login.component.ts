import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../../services/login.service';

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
    private loginService: LoginService,
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

      const credentials = {
        correo: this.loginGroup.get('correo')?.value,
        contrasena: this.loginGroup.get('contrasena')?.value
      };

      this.loginService.login(credentials).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = '¡Login exitoso! Redirigiendo...';
          localStorage.setItem('user', JSON.stringify(response.data));
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 1000); // Aumenta a 3 segundos para mayor visibilidad
        },
        error: (error) => {
          this.isLoading = false;
          // Personaliza el mensaje según el error
          if (error.status === 401 ) {
            this.errorMessage = 'Credenciales incorrectas. Por favor, intenta de nuevo.';
          } else {
            this.errorMessage = `Credenciales incorrectas. Por favor, intenta de nuevo.`;
          }
          console.error('Error en login:', error);
        }
      });
    }
  }
    goHome() {
    this.router.navigate(['/home']);
  }
}
