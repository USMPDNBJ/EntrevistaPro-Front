import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent {
  code: string = '';

  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/login']);
  }

  resendCode() {
    // Lógica para reenviar código (a implementar según backend)
    console.log('Código reenviado');
  }

  verifyCode() {
    if (this.code) {
      // Lógica para verificar código (a implementar según backend)
      console.log('Código verificado:', this.code);
      this.router.navigate(['/dashboard']);
    }
  }
}
