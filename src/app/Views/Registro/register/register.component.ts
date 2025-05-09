import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  standalone: true,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  selectedSkills: string[] = [];
  userGroup: FormGroup;
  nombres: FormControl;
  apellidos: FormControl;
  correo: FormControl;
  dni: FormControl;
  celular: FormControl;
  contrasena: FormControl;
  constructor(){
    this.nombres = new FormControl('');
    this.apellidos = new FormControl('');
    this.correo = new FormControl('');
    this.dni = new FormControl('');
    this.celular = new FormControl('');
    this.contrasena = new FormControl('');
    this.userGroup = new FormGroup({
      nombres: this.nombres,
      apellidos: this.apellidos,
      correo: this.correo,
      dni: this.dni,
      celular: this.celular,
      contrasena: this.contrasena
    })
  }

  toggleSkill(skill: string) {
    if (this.selectedSkills.includes(skill)) {
      this.selectedSkills = this.selectedSkills.filter(s => s !== skill);
    } else if (this.selectedSkills.length < 3) {
      this.selectedSkills.push(skill);
    }

    // Forzar actualización de la vista
    this.updateSkillSelection();
  }

  // Método para actualizar la selección visualmente (opcional, pero mejora la experiencia)
  updateSkillSelection() {
    // Esto asegura que Angular detecte los cambios
    setTimeout(() => {}, 0);
  }
}
