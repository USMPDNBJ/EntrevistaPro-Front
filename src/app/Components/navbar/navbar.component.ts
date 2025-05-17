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
  rol: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.rol$.subscribe(rol => {
      this.rol = rol;
      console.log('Rol en Navbar:', rol, 'userId:', this.authService.getUserId());
    });
  }

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
  }

  logout() {
    this.authService.clearUserId();
    this.router.navigate(['/auth/login']);
  }
}
