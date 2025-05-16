import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterModule, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isExpanded = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
    const mainContent = document.querySelector('main');
    // Ajustes de contenido principal si es necesario
  }

  logout() {
    this.authService.clearUserId();
    this.router.navigate(['/auth/login']);
  }
}
