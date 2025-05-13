import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-wrapper',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="auth">
      <router-outlet></router-outlet>
    </div>
  `,
  styleUrls: ['../../assets/styles/auth/auth-global.css'],
})
export class AuthWrapperComponent { }
