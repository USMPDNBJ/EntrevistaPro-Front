import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-perfil-wrapper',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="perfil">
      <router-outlet></router-outlet>
    </div>
  `,
  styleUrls: ['../../assets/styles/perfil/perfil-global.css'],
})
export class PerfilWrapperComponent { }
