import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterLink, RouterModule, ActivatedRoute} from '@angular/router';
import { Router, RouterLinkActive, NavigationEnd } from '@angular/router';
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
  isLoggedIn = false;
  userId: string | null = null;
  constructor(private route: ActivatedRoute, @Inject(PLATFORM_ID) private platformId: Object) { }

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
    const mainContent = document.querySelector('main');
  }

  ngOnInit() {
      if (isPlatformBrowser(this.platformId)) {
      this.isLoggedIn = localStorage.getItem('message') === 'Realizado';
    }
  }

}
