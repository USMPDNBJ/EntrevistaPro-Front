import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RegisterService } from '../../../services/register.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  userGroup: FormGroup;
  selectedSkills: string[] = [];
  isLoading: boolean = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private registerService: RegisterService,
    private router: Router
  ) {
    this.userGroup = this.fb.group({
      nombres: ['', [Validators.required, Validators.minLength(2)]],
      apellidos: ['', [Validators.required, Validators.minLength(2)]],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      celular: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
    });
  }

  toggleSkill(skill: string) {
    if (this.selectedSkills.includes(skill)) {
      this.selectedSkills = this.selectedSkills.filter((s) => s !== skill);
    } else if (this.selectedSkills.length < 3) {
      this.selectedSkills.push(skill);
    }
  }

  onSubmit() {
    if (this.userGroup.valid && this.selectedSkills.length > 0) {
      this.isLoading = true;
      this.successMessage = null;
      this.errorMessage = null;

      const userData = {
        ...this.userGroup.value,
        habilidades: this.selectedSkills,
      };

      this.registerService.register(userData).subscribe({
        next: (response) => {
          console.log('Respuesta de la API:', response);
          this.isLoading = false;
          this.successMessage = '¡Registro exitoso! Redirigiendo al login...';
          sessionStorage.setItem('user', JSON.stringify(response.data));
          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 3000);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error en registro:', error);
          if (error.status === 409) {
            this.errorMessage = 'El correo ya está registrado. Usa otro correo.';
          } else if (error.status === 400) {
            this.errorMessage = 'Datos inválidos. Verifica los campos e intenta de nuevo.';
          } else {
            this.errorMessage = `Error: ${error.status} - ${error.message}`;
          }
        },
      });
    } else {
      this.errorMessage = 'Por favor, completa todos los campos y selecciona al menos una habilidad.';
    }
  }
}
