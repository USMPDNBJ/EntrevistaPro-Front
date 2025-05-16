import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { Router, RouterLinkActive,NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  isExpanded = false;
  isHomePage: boolean = false;
  constructor(private router: Router) { }
  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
    const mainContent = document.querySelector('main');

  }
  ngOnInit() {
    console.log('Suscribiendo a router.events');
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        console.log('NavigationEnd:', event.urlAfterRedirects);
        this.isHomePage = event.urlAfterRedirects === '/' || event.urlAfterRedirects === '/home';
        console.log('isHomePage:', this.isHomePage)
      });
  }
  logout() {
    this.router.navigate(['/']);
  }

}
