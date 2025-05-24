import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment-gateway',
  templateUrl: './pasarela.component.html',
  styleUrls: ['./pasarela.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ]
})
export class pasarelaComponent implements OnInit {
  paymentForm: FormGroup;
  isProcessing = false;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.paymentForm = this.fb.group({
      cardNumber: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{16}$'),
        this.luhnValidator()
      ]],
      cardHolder: ['', [
        Validators.required,
        Validators.pattern('^[a-zA-Z ]+$')
      ]],
      expiryDate: ['', [
        Validators.required,
        Validators.pattern('^(0[1-9]|1[0-2])/[0-9]{2}$')
      ]],
      cvv: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{3,4}$')
      ]],
      amount: ['', [
        Validators.required,
        Validators.min(1)
      ]]
    });
  }

  ngOnInit(): void { }

  private luhnValidator() {
    return (control: any) => {
      if (!control.value) return null;

      let sum = 0;
      let isEven = false;
      const value = control.value.replace(/\D/g, '');

      for (let i = value.length - 1; i >= 0; i--) {
        let digit = parseInt(value.charAt(i), 10);

        if (isEven) {
          digit *= 2;
          if (digit > 9) digit -= 9;
        }

        sum += digit;
        isEven = !isEven;
      }

      return (sum % 10) === 0 ? null : { invalidCard: true };
    };
  }

  async processPayment() {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    this.isProcessing = true;

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const isSuccess = Math.random() > 0.2;

      if (isSuccess) {
        this.snackBar.open('¡Pago procesado exitosamente!', 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.paymentForm.reset();
      } else {
        throw new Error('Error en el procesamiento del pago');
      }
    } catch (error) {
      this.snackBar.open('Error al procesar el pago. Intente nuevamente.', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    } finally {
      this.isProcessing = false;
    }
  }

  get cardNumber() { return this.paymentForm.get('cardNumber'); }
  get cardHolder() { return this.paymentForm.get('cardHolder'); }
  get expiryDate() { return this.paymentForm.get('expiryDate'); }
  get cvv() { return this.paymentForm.get('cvv'); }
  get amount() { return this.paymentForm.get('amount'); }
}
