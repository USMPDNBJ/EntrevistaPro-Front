// src/app/Views/Agendar/agendar-reunion/agendar-reunion.component.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../Components/navbar/navbar.component';
import Sessions from '../../../models/sessions';
import { SessionService } from '../../../services/session.service';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink, CommonModule, FormsModule, NavbarComponent],
  selector: 'app-agendar-reunion',
  templateUrl: './agendar-reunion.component.html',
  styleUrls: ['./agendar-reunion.component.css']
})
export class AgendarReunionComponent {
  currentMonth: string = new Date().toLocaleString('default', { month: 'long' });
  currentYear: number = new Date().getFullYear();
  selectedDay: number | null = null;
  selectedMonth: string | null = null;
  selectedYear: number | null = null;
  selectedTime: string | null = null;
  view: string = 'month';
  daysOfWeek: string[] = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  days: number[] = [];
  emptyDaysBefore: number[] = [];
  weekDays: { day: number, month: string, year: number, label: string, isSunday: boolean }[] = [];
  yearMonths: string[] = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  timeSlots: string[] = Array.from({ length: 14 }, (_, i) => {
    // Comienza desde las 8:00 AM (8:00)
    const hour = i + 8; // Añadir 8 para que las horas comiencen desde las 8:00
    return `${hour.toString().padStart(2, '0')}:00`;
  });
  currentWeekStart: Date = new Date();
  userId: number;
  ngOnInit() {
    this.currentMonth = this.capitalizeFirstLetter(new Date().toLocaleString('default', { month: 'long' }));
    // Set currentWeekStart to the start of the current week (Sunday)
    this.currentWeekStart = new Date();
    const dayOfWeek = this.currentWeekStart.getDay();
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() - dayOfWeek); // Move to Sunday
    this.generateMonthDays();
    this.generateWeekDays();
  }

  isSunday(day: number, month: string, year: number): boolean {
    const date = new Date(year, this.getMonthIndex(month), day);
    return date.getDay() === 0;
  }
  isMonthSelectable(monthIndex: number): boolean {
    const currentDate = new Date();
    return this.currentYear > currentDate.getFullYear() ||
      (this.currentYear === currentDate.getFullYear() && monthIndex >= currentDate.getMonth());
  }
  constructor(private userService: SessionService) {
    const storedUserId = sessionStorage.getItem('userId');
    if (storedUserId) {
      this.userId = Number(storedUserId);
    } else {
      console.error('No se encontró el userId en localStorage');
      this.userId = 0;
    }
  }
  capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  get displayPeriod(): string {
    if (this.view === 'month') {
      return `${this.currentMonth} ${this.currentYear}`;
    } else if (this.view === 'week') {
      const weekEnd = new Date(this.currentWeekStart);
      weekEnd.setDate(this.currentWeekStart.getDate() + 6);
      return `${this.currentWeekStart.getDate()} ${this.capitalizeFirstLetter(this.currentWeekStart.toLocaleString('default', { month: 'long' }))} - ${weekEnd.getDate()} ${this.capitalizeFirstLetter(weekEnd.toLocaleString('default', { month: 'long' }))} ${weekEnd.getFullYear()}`;
    } else {
      return `${this.currentYear}`;
    }
  }

  generateMonthDays() {
    const monthIndex = this.getMonthIndex(this.currentMonth);
    const firstDayOfMonth = new Date(this.currentYear, monthIndex, 1);
    const lastDayOfMonth = new Date(this.currentYear, monthIndex + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const firstDayOfWeek = firstDayOfMonth.getDay();

    this.days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    this.emptyDaysBefore = Array(firstDayOfWeek).fill(null);
  }

  generateWeekDays() {
    this.weekDays = [];
    const startDate = new Date(this.currentWeekStart);
    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      this.weekDays.push({
        day: day.getDate(),
        month: this.capitalizeFirstLetter(day.toLocaleString('default', { month: 'long' })),
        year: day.getFullYear(),
        label: this.daysOfWeek[i],
        isSunday: day.getDay() === 0 // true if it's Sunday
      });
    }
  }

  getMonthIndex(monthName: string): number {
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    return months.findIndex(m => m.toLowerCase() === monthName.toLowerCase());
  }

  prevPeriod() {
    if (this.view === 'month') {
      const newMonthIndex = this.getMonthIndex(this.currentMonth) - 1;
      const currentDate = new Date();
      if (newMonthIndex < 0) {
        if (this.currentYear > currentDate.getFullYear()) {
          this.currentYear--;
          this.currentMonth = 'Diciembre';
        }
      } else if (this.currentYear > currentDate.getFullYear() || newMonthIndex >= currentDate.getMonth()) {
        this.currentMonth = this.capitalizeFirstLetter(new Date(this.currentYear, newMonthIndex).toLocaleString('default', { month: 'long' }));
      }
      this.generateMonthDays();
    } else if (this.view === 'week') {
      this.currentWeekStart.setDate(this.currentWeekStart.getDate() - 7);
      this.generateWeekDays();
    } else {
      if (this.currentYear > new Date().getFullYear()) {
        this.currentYear--;
      }
    }
  }

  nextPeriod() {
    if (this.view === 'month') {
      const newMonthIndex = this.getMonthIndex(this.currentMonth) + 1;
      if (newMonthIndex > 11) {
        this.currentYear++;
        this.currentMonth = 'Enero';
      } else {
        this.currentMonth = this.capitalizeFirstLetter(new Date(this.currentYear, newMonthIndex).toLocaleString('default', { month: 'long' }));
      }
      this.generateMonthDays();
    } else if (this.view === 'week') {
      this.currentWeekStart.setDate(this.currentWeekStart.getDate() + 7);
      this.generateWeekDays();
    } else {
      this.currentYear++;
    }
  }

  selectDay(day: number, month: string = this.currentMonth, year: number = this.currentYear) {
    // Crear un objeto Date para verificar si el día es domingo
    const selectedDate = new Date(year, this.getMonthIndex(month), day);
    if (selectedDate.getDay() === 0) {
      // No permitir la selección si es domingo
      return;
    }

    // Lógica existente para seleccionar/desmarcar un día
    if (this.selectedDay === day && this.selectedMonth === month && this.selectedYear === year) {
      this.selectedDay = null;
      this.selectedMonth = null;
      this.selectedYear = null;
      this.selectedTime = null;
    } else {
      this.selectedDay = day;
      this.selectedMonth = month;
      this.selectedYear = year;
    }
  }

  changeView(view: string) {
    this.view = view;
    this.selectedDay = null;
    this.selectedMonth = null;
    this.selectedYear = null;
    this.selectedTime = null;
    if (this.view === 'week') {
      this.generateWeekDays();
    }
  }

  selectMonth(month: string) {
    this.currentMonth = month.charAt(0).toUpperCase() + month.slice(1).toLowerCase();
    this.generateMonthDays();
    this.view = 'month';
  }

  updateTime() {
    // Lógica para manejar la selección de hora (si necesitas algo más complejo, avísame)
  }

  scheduleMeeting() {
    if (!this.selectedDay || !this.selectedMonth || !this.selectedYear || !this.selectedTime) {
      console.error('Faltan datos para agendar la reunión');
      return; // Si no se seleccionaron todos los campos, no se agenda la reunión
    }

    // Crear una cadena de fecha en formato "yyyy-MM-dd"
    const meetingDate = `${this.selectedYear}-${this.getMonthIndex(this.selectedMonth) + 1}-${this.selectedDay}`;

    // Convertir la cadena meetingDate a un objeto Date
    const meetingDateObj = new Date(meetingDate);
    const [horas, minutos] = this.selectedTime.split(':').map(Number);
    let nuevasHoras = horas + 1;
    const session: Sessions = {
      id: undefined,
      profesional_id: 0,
      usuario_id: this.userId,
      id_pago: 0,
      fecha: meetingDateObj,
      hora_inicio: this.selectedTime,
      estado: 'pendiente',
      evaluacion: undefined,
      enlace: undefined
    };
    session.hora_fin = `${nuevasHoras.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
    sessionStorage.setItem('pasarela', 'session');
    sessionStorage.setItem('ss_reunion', JSON.stringify(session));
    sessionStorage.setItem('precio', '30');
  }

}
