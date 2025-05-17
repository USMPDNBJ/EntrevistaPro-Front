import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { GestionarTrabajadoresComponent } from '../../Views/Admin/gestionar-trabajadores/gestionar-trabajadores.component';
import { NavbarComponent } from '../../Components/navbar/navbar.component';

const routes: Routes = [
  { path: 'trabajadores', component: GestionarTrabajadoresComponent }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    GestionarTrabajadoresComponent,
    NavbarComponent
  ],
  exports: []
})
export class AdminModule {}
