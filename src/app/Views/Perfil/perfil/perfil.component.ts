import { Component } from '@angular/core';
import { NavbarComponent } from '../../../Components/navbar/navbar.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-perfil',
  imports: [NavbarComponent, RouterLink],
  standalone: true,
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {

}
