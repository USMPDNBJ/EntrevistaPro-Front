import { Component } from '@angular/core';
import { NavbarComponent } from '../../Components/navbar/navbar.component';
import { ContainerComponent } from '../../Components/container/container.component';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../../Components/footer/footer.component';

@Component({
  selector: 'app-home',
  imports: [NavbarComponent, ContainerComponent, RouterOutlet, FormsModule, FooterComponent], // Añade FormsModule
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  searchTerm: string = ''; // Añade la propiedad searchTerm

  buscarCursos(event: Event) { // Añade la función buscarCursos
    event.preventDefault(); // Evita que el formulario recargue la página
    if (this.searchTerm.trim()) {
      console.log('Buscando cursos:', this.searchTerm);
      // Aquí puedes implementar la lógica de búsqueda real, como una llamada a un servicio
    }
  }
}
