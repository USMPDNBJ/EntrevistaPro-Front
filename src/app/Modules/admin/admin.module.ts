import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { GestionarTrabajadoresComponent } from '../../Views/Admin/gestionar-trabajadores/gestionar-trabajadores.component';
import { NavbarComponent } from '../../Components/navbar/navbar.component';
import { GestionarUsuariosComponent } from '../../Views/Admin/gestionar-usuarios/gestionar-usuarios.component';
import { GestionarSesionesComponent } from '../../Views/Admin/gestionar-sesiones/gestionar-sesiones.component';
import { GestionarCursosComponent } from '../../Views/Admin/gestionar-cursos/gestionar-cursos.component';

const routes: Routes = [
  { path: 'trabajadores', component: GestionarTrabajadoresComponent },
  { path: 'usuarios', component: GestionarUsuariosComponent},
  { path: 'sesiones', component: GestionarSesionesComponent},
  { path: 'cursos', component: GestionarCursosComponent}
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    GestionarTrabajadoresComponent,
    GestionarUsuariosComponent,
    GestionarSesionesComponent,
    GestionarCursosComponent,
    NavbarComponent
  ],
  exports: []
})
export class AdminModule {}
