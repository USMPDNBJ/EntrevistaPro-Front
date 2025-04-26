import { Routes } from '@angular/router';
import { HomeComponent } from './Views/home/home.component';
import { AboutUsComponent } from './Views/about-us/about-us.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutUsComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];
