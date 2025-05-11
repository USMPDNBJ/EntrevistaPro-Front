import { Routes } from '@angular/router';
import { AuthWrapperComponent} from './auth/auth-wrapper.component';
import { MainWrapperComponent } from './main/main-wrapper.component';
import { PerfilWrapperComponent } from './perfil/perfil-wrapper.component';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthWrapperComponent,
    children: [
      { path: 'login', loadComponent: () => import('./Views/Registro/login/login.component').then(m => m.LoginComponent),},
      { path: 'register',loadComponent: () => import('./Views/Registro/register/register.component').then(m => m.RegisterComponent),},
      { path: 'verify', loadComponent: () => import('./Views/Registro/verify/verify.component').then(m => m.VerifyComponent),},
      { path: '', redirectTo: 'login', pathMatch: 'full' }, // Redirige /auth a /auth/login
    ],
  },
  {
    path: '',
    component: MainWrapperComponent,
    children: [
      { path: '', loadComponent: () => import('./Views/Principal/home/home.component').then(m => m.HomeComponent),},
      { path: 'home', loadComponent: () => import('./Views/Principal/home/home.component').then(m => m.HomeComponent), },
      { path: 'about-us', loadComponent: () => import('./Views/Principal/about-us/about-us.component').then(m => m.AboutUsComponent),},
      { path: 'cursos', loadComponent: () => import('./Views/Principal/cursos/cursos.component').then(m => m.CursosComponent),},
    ],
  }, // Ruta por defecto
  {
    path: 'perfil',
    component: PerfilWrapperComponent,
    children: [
      { path: '', loadComponent: () => import('./Views/Perfil/perfil/perfil.component').then(m => m.PerfilComponent) },
      { path: 'historial', loadComponent: () => import('./Views/Perfil/historial/historial.component').then(m => m.HistorialComponent) },
      { path: '', redirectTo: 'perfil', pathMatch: 'full' },
    ],
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full' },
];
