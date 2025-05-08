import { Component } from '@angular/core';
import { FooterComponent } from "../../../Components/footer/footer.component";
import { NavbarComponent } from "../../../Components/navbar/navbar.component";

@Component({
  selector: 'app-cursos',
  imports: [FooterComponent, NavbarComponent],
  templateUrl: './cursos.component.html',
  styleUrl: './cursos.component.css'
})
export class CursosComponent {

}
