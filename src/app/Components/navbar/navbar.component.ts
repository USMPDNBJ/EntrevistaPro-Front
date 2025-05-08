import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isExpanded = false;

    toggleSidebar() {
        this.isExpanded = !this.isExpanded;
        const mainContent = document.querySelector('main');
        if (mainContent) {
            if (window.innerWidth <= 480) {
                mainContent.style.marginLeft = '0';
            } else if (window.innerWidth <= 768) {
                mainContent.style.marginLeft = this.isExpanded ? '16rem' : '3rem';
            } else {
                mainContent.style.marginLeft = this.isExpanded ? '20rem' : '4rem';
            }
        }
    }
}
