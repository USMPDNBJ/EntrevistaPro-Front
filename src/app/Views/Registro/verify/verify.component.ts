import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent {
  verificationGroup: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.verificationGroup = this.fb.group({
      codigo: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    });
  }

  goBack(): void {
    this.router.navigate(['/login']);
  }
}
