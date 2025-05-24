import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { GestionarTrabajadoresComponent } from '../../Views/Admin/gestionar-trabajadores/gestionar-trabajadores.component';
import { NavbarComponent } from '../../Components/navbar/navbar.component';
import { GestionarUsuariosComponent } from '../../Views/Admin/gestionar-usuarios/gestionar-usuarios.component';
import { GestionarSesionesComponent } from '../../Views/Admin/gestionar-sesiones/gestionar-sesiones.component';

const routes: Routes = [
  { path: 'trabajadores', component: GestionarTrabajadoresComponent },
  { path: 'usuarios', component: GestionarUsuariosComponent},
  { path: 'sesiones', component: GestionarSesionesComponent}
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
    NavbarComponent
  ],
  exports: []
})
export class AdminModule {}
