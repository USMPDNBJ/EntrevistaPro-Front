import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule],
  standalone: true,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

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
}
