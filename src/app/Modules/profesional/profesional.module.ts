import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NavbarComponent } from '../../Components/navbar/navbar.component';
import { VerSesionesComponent } from '../../Views/Profesional/ver-sesiones/ver-sesiones.component';
import { AuthGuard } from '../../services/auth.guard';

const routes: Routes = [
  { path: 'ver-sesiones', component: VerSesionesComponent, canActivate: [AuthGuard], data: { roles: ['worker'] } }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    VerSesionesComponent,
    NavbarComponent
  ],
  exports: []
})
export class ProfesionalModule {}