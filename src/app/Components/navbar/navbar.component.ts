import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterModule, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isExpanded = false;

  constructor() {}

  ngOnInit() {
    // No navigation logic needed for link visibility
  }

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
    const mainContent = document.querySelector('main');
    // Add any main content adjustments if needed
  }
}
