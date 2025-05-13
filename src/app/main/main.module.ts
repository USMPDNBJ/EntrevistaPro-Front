import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../Views/Principal/home/home.component';
import { AboutUsComponent } from '../Views/Principal/about-us/about-us.component';
import { CursosComponent } from '../Views/Principal/cursos/cursos.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'cursos', component: CursosComponent },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    HomeComponent,
    AboutUsComponent,
    CursosComponent,
  ],
})
export class MainModule { }
