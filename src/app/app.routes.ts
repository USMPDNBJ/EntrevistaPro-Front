import { Routes } from '@angular/router';
import { AuthWrapperComponent } from './auth/auth-wrapper.component';
import { MainWrapperComponent } from './main/main-wrapper.component';
import { PerfilWrapperComponent } from './perfil/perfil-wrapper.component';
import { LoginComponent } from './Views/Registro/login/login.component';
import { RegisterComponent } from './Views/Registro/register/register.component';
import { AboutUsComponent } from './Views/Principal/about-us/about-us.component';
import { CursosComponent } from './Views/Principal/cursos/cursos.component';
import { HomeComponent } from './Views/Principal/home/home.component';
import { AgendarReunionComponent } from './Views/Principal/agendar-reunion/agendar-reunion.component';
import { PerfilComponent } from './Views/Perfil/perfil/perfil.component';
import { HistorialComponent } from './Views/Perfil/historial/historial.component';
import { AuthGuard } from './services/auth.guard';
export const routes: Routes = [
  {
    path: 'auth',
    component: AuthWrapperComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
  {
    path: '',
    component: MainWrapperComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'about-us', component: AboutUsComponent },
      { path: 'cursos', component: CursosComponent },
      { path: 'agendar-reunion', component: AgendarReunionComponent, canActivate: [AuthGuard] },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
  {
    path: 'perfil',
    component: PerfilWrapperComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: PerfilComponent },
      { path: 'historial', component: HistorialComponent },
    ],
  },
  { path: '**', redirectTo: '/home', pathMatch: 'full' },
];
