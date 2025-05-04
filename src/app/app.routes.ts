import { Routes } from '@angular/router';
import { LoginComponent } from './Views/login/login.component';
import { RegisterComponent } from './Views/register/register.component';
import { HomeComponent } from './Views/home/home.component';
import { AboutUsComponent } from './Views/about-us/about-us.component';
import { VerifyComponent } from './Views/verify/verify.component';


export const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutUsComponent },
  { path: 'verify', component: VerifyComponent},
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
