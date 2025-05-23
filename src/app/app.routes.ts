import { Routes } from '@angular/router';
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
import { AuthWrapperComponent } from './Modules/auth/auth-wrapper.component';
import { MainWrapperComponent } from './Modules/main/main-wrapper.component';
import { AdminWrapperComponent } from './Modules/admin/admin-wrapper.component';
import { pasarelaComponent } from './Views/Principal/pasarela/pasarela.component';

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
      { path: 'cursos', component: CursosComponent, canActivate: [AuthGuard], data: { roles: ['user', 'admin'] } },
      { path: 'agendar-reunion', component: AgendarReunionComponent, canActivate: [AuthGuard], data: { roles: ['user', 'admin'] } },
      { path: 'pasarela', component: pasarelaComponent},
      { path: 'mis-sesiones', component: MisSesionesComponent, canActivate: [AuthGuard], data: { roles: ['user', 'admin'] } },
      { path: '', redirectTo: '/auth', pathMatch: 'full' },
    ],
  },
  {
    path: 'perfil',
    component: PerfilWrapperComponent,
    canActivate: [AuthGuard],
    data: { roles: ['user', 'admin'] },
    children: [
      { path: '', component: PerfilComponent },
      { path: 'historial', component: HistorialComponent },
    ],
  },
  {
    path: 'admin',
    component: AdminWrapperComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin'] },
    children: [
      {
        path: '',
        loadChildren: () => import('./Modules/admin/admin.module').then(m => m.AdminModule)
      }
    ]
  },
  { path: '**', redirectTo: '/auth/login', pathMatch: 'full' },
];
