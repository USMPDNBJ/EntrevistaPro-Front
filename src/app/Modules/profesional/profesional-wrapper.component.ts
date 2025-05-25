import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../Components/navbar/navbar.component';

@Component({
  selector: 'app-admin-wrapper',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="admin-container">
      <router-outlet></router-outlet>
    </div>
  `,
  styleUrls: ['../../../assets/styles/admin/admin-global.css']
})
export class ProfesionalWrapperComponent {}
