import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-wrapper',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="main">
      <router-outlet></router-outlet>
    </div>
  `,
  styleUrls: ['../../assets/styles/main/main-global.css'],
})
export class MainWrapperComponent { }
