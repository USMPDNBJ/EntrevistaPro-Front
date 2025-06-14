import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DomSanitizer } from '@angular/platform-browser';
import Sessions from '../../../models/sessions';
import Pago from '../../../models/pago';
import CoursePayed from '../../../models/coursePayed';
import { SessionService } from '../../../services/session.service';
import { NavbarComponent } from "../../../Components/navbar/navbar.component";
import { CourseService } from '../../../services/course.service';



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
    MatSnackBarModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NavbarComponent
  ]
})
export class pasarelaComponent implements OnInit {
  paymentForm: FormGroup;
  isProcessing = false;
  cardType: string | null = null;
  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth() + 1;
  scheduleType = sessionStorage.getItem('pasarela');
  userId = Number(sessionStorage.getItem('userId'));
  courseId = Number(sessionStorage.getItem('courseId'));
  monto = Number(sessionStorage.getItem('precio'));
  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private serviceSession: SessionService,
    private serviceCourse: CourseService,
    private location: Location,
    private router: Router
  ) {

    this.iconRegistry.addSvgIcon(
      'custom-payment',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/payment.svg')
    );
    this.paymentForm = this.fb.group({
      cardNumber: ['', [
        Validators.required,
        Validators.pattern(/^[0-9\s]{13,19}$/), // Permite espacios y longitud variable
        this.luhnValidator()
      ]],
      cardHolder: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/),
        Validators.maxLength(50)
      ]],
      expiryDate: ['', [
        Validators.required,
        Validators.pattern(/^(0[1-9]|1[0-2])\/([0-9]{2})$/),
        this.expiryDateValidator()
      ]],
      cvv: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{3,4}$/)
      ]],
      amount: [{ value: this.monto, disabled: true }, [
        Validators.required,
        Validators.min(1),
        Validators.max(10000)
      ]]
    });
  }

  ngOnInit(): void {
    this.paymentForm.get('cardNumber')?.valueChanges.subscribe(value => {
      this.detectCardType(value);
    });
  }

  private luhnValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.replace(/\s+/g, '');
      if (!value || !/^\d+$/.test(value)) return null;

      let sum = 0;
      let alternate = false;

      for (let i = value.length - 1; i >= 0; i--) {
        let digit = parseInt(value.charAt(i), 10);

        if (alternate) {
          digit *= 2;
          if (digit > 9) digit -= 9;
        }

        sum += digit;
        alternate = !alternate;
      }

      return sum % 10 === 0 ? null : { invalidCard: true };
    };
  }

  private expiryDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      const [monthStr, yearStr] = value.split('/');
      const month = parseInt(monthStr, 10);
      const year = 2000 + parseInt(yearStr, 10);
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;

      // Verifica mes válido (1-12)
      if (month < 1 || month > 12) return { invalidDate: true };

      // Verifica año no menor al actual
      if (year < currentYear) return { expired: true };

      // Si es el mismo año, verifica mes no pasado
      if (year === currentYear && month < currentMonth) return { expired: true };

      return null;
    };
  }

  public detectCardType(cardNumber: string): void {
    const cleaned = cardNumber?.replace(/\s+/g, '') || '';

    // Visa: 13 o 16 dígitos, empieza con 4
    if (/^4[0-9]{12}(?:[0-9]{3})?$/.test(cleaned)) {
      this.cardType = 'visa';
    }
    // Mastercard: 16 dígitos, empieza con 51-55 o 2221-2720
    else if (/^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/.test(cleaned)) {
      this.cardType = 'mastercard';
    }
    // AMEX: 15 dígitos, empieza con 34 o 37
    else if (/^3[47][0-9]{13}$/.test(cleaned)) {
      this.cardType = 'amex';
    } else {
      this.cardType = null;
    }
  }
  goBack(): void {
    this.location.back();
  }
  async processPayment(): Promise<void> {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      this.snackBar.open('Por favor complete todos los campos correctamente', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    this.isProcessing = true;

    try {
      // Notificación de éxito (simulando pago exitoso)
      this.snackBar.open('¡Pago procesado exitosamente!', 'Cerrar', {
        duration: 5000,
        panelClass: ['success-snackbar'],
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });

      // Extraer datos del formulario
      let numeroTarjeta = this.cardNumber?.value;
      let titular = this.cardHolder?.value;
      let expiry = this.expiryDate?.value; // ejemplo: "10/25"
      let [month, year] = expiry.split("/").map((val: string) => parseInt(val));
      if (year < 100) year += 2000;
      let fecExp = new Date(year, month - 1, 1);
      let cvv = this.cvv?.value;
      let monto = this.amount?.value;
      let pago = new Pago(undefined, numeroTarjeta, titular, fecExp, cvv, monto);
      let c_session: Sessions;
      console.log(pago);

      // Guardar pago en el backend
      this.serviceSession.createPago(pago).subscribe({
        next: (res) => {
          console.log('Respuesta createPago:', res);
          let idPago = res.id_pago;

          if (!idPago) {
            console.error('No se recibió id_pago válido');
            return;
          }

          if (this.scheduleType === 'course') {
            this.paymentForm.reset({
              amount: { value: monto, disabled: true }
            });
            let coursePayed: CoursePayed = { id_course: this.courseId, id_user: this.userId, id_pago: idPago };
            this.serviceCourse.postCreateCoursePayed(coursePayed).subscribe({
              next: (res) => {
                console.log('Pago guardado', res);
                this.router.navigate(['/mis-cursos']);
              },
              error: (err) => console.error('Error al guardar el pago', err)
            });
          } else if (this.scheduleType === 'session') {
            const sessionData = sessionStorage.getItem('ss_reunion');
            if (sessionData) {
              c_session = JSON.parse(sessionData) as Sessions;
              c_session.id_pago = idPago;
              c_session.profesional_id = undefined;
              this.serviceSession.postSession(c_session).subscribe({
                next: (res) => {
                  console.log('Pago guardado', res);
                  this.router.navigate(['/mis-sesiones']);
                },
                error: (err) => console.error('Error al guardar el pago', err)
              });
            }
          } else {
            console.error('Tipo de agendamiento no válido:', this.scheduleType);
            return;
          }
        },
        error: (err) => console.error('Error al guardar el pago', err)
      });

      this.cardType = null;
    } catch (error) {
      console.error('Payment error:', error);
      this.snackBar.open('Error al procesar el pago. Por favor intente nuevamente.', 'Cerrar', {
        duration: 5000,
        panelClass: ['error-snackbar'],
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    } finally {
      this.isProcessing = false;
    }
  }

  // Getters para acceder fácilmente a los controles del formulario
  get cardNumber() { return this.paymentForm.get('cardNumber'); }
  get cardHolder() { return this.paymentForm.get('cardHolder'); }
  get expiryDate() { return this.paymentForm.get('expiryDate'); }
  get cvv() { return this.paymentForm.get('cvv'); }
  get amount() { return this.paymentForm.get('amount'); }
}
