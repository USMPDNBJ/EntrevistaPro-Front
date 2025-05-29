import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../Components/navbar/navbar.component';

@Component({
  selector: 'app-profesional-wrapper',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="profesional-container">
      <router-outlet></router-outlet>
    </div>
  `,
  styleUrls: ['../../../assets/styles/admin/admin-global.css']
})
export class ProfesionalWrapperComponent {}
