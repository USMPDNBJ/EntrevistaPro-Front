import { Component } from '@angular/core';
import { FooterComponent } from '../../../Components/footer/footer.component';
import { NavbarComponent } from '../../../Components/navbar/navbar.component';

@Component({
  selector: 'app-about-us',
  imports: [FooterComponent, NavbarComponent],
  standalone: true,
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css'
})
export class AboutUsComponent {

}
