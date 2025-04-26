import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './Views/home/home.component';
import { AboutUsComponent } from './Views/about-us/about-us.component';


export const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutUsComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
