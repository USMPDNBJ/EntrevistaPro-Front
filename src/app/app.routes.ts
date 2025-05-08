import { Routes } from '@angular/router';
import { LoginComponent } from './Views/Registro/login/login.component';
import { RegisterComponent } from './Views/Registro/register/register.component';
import { HomeComponent } from './Views/Principal/home/home.component';
import { AboutUsComponent } from './Views/Principal/about-us/about-us.component';
import { VerifyComponent } from './Views/Registro/verify/verify.component';
import { CursosComponent } from './Views/Principal/cursos/cursos.component';


export const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutUsComponent },
  { path: 'verify', component: VerifyComponent},
  { path: 'cursos', component: CursosComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
