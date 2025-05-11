import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { PerfilComponent } from '../Views/Perfil/perfil/perfil.component';
import { HistorialComponent } from '../Views/Perfil/historial/historial.component';

const routes: Routes = [
  { path: 'perfil', component: PerfilComponent },
  { path: 'historial', component: HistorialComponent }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    PerfilComponent,
    HistorialComponent
  ],
})
export class AuthModule { }
