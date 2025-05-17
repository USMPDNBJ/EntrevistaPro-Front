import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../../Views/Principal/home/home.component';
import { AboutUsComponent } from '../../Views/Principal/about-us/about-us.component';
import { CursosComponent } from '../../Views/Principal/cursos/cursos.component';
import { AgendarReunionComponent } from '../../Views/Principal/agendar-reunion/agendar-reunion.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'cursos', component: CursosComponent },
  { path: 'agendar-reunion', component: AgendarReunionComponent },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    HomeComponent,
    AboutUsComponent,
    CursosComponent,
    AgendarReunionComponent,
  ],
})
export class MainModule { }
