import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from '../Views/Registro/login/login.component';
import { RegisterComponent } from '../Views/Registro/register/register.component';
import { VerifyComponent } from '../Views/Registro/verify/verify.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'verify', component: VerifyComponent },
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    LoginComponent,
    RegisterComponent,
    VerifyComponent,
  ],
})
export class AuthModule { }
