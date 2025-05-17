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
import { MisSesionesComponent } from './Views/Principal/mis-sesiones/mis-sesiones.component';

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
      { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
      { path: 'about-us', component: AboutUsComponent },
      { path: 'cursos', component: CursosComponent, canActivate: [AuthGuard] },
      { path: 'agendar-reunion', component: AgendarReunionComponent, canActivate: [AuthGuard] },
      { path: 'mis-sesiones', component: MisSesionesComponent, canActivate: [AuthGuard] },
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
  {
    path: 'admin',
    component: MainWrapperComponent,
    canActivate: [AuthGuard],
    children: [
      //{ path: 'usuarios', component: UsuariosComponent, canActivate: [AuthGuard] },
      //{ path: 'trabajadores', component: TrabajadoresComponent, canActivate: [AuthGuard] },
      //{ path: 'gestionar-sesiones', component: GestionarSesionesComponent, canActivate: [AuthGuard] },
    ],
  },
  { path: '**', redirectTo: '/auth/login', pathMatch: 'full' },
];
