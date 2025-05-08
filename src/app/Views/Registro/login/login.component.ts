import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm: FormGroup;
  email: FormControl;
  password: FormControl;
  constructor() {
    this.email = new FormControl('', [Validators.required]);
    this.password = new FormControl('', [Validators.required]);

    this.loginForm = new FormGroup({
      email: this.email,
      password: this.password,

    })
  }
  // postLogin(){
  //   this.loginService.login(this.loginForm.value).subscribe({
  //     next: (data) =>{
  //       console.log(data);
  //     },
  //     error: (e)=>{
  //       console.log(e);
  //     }
  //   })
  // }
}
