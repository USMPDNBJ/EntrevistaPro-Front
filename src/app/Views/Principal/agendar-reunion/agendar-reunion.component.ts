// src/app/Views/Agendar/agendar-reunion/agendar-reunion.component.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../Components/navbar/navbar.component';

@Component({
  imports: [CommonModule, FormsModule, NavbarComponent],
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
  weekDays: { day: number, month: string, year: number, label: string }[] = [];
  yearMonths: string[] = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  timeSlots: string[] = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);
  currentWeekStart: Date = new Date();

  ngOnInit() {
    this.currentMonth = this.capitalizeFirstLetter(new Date().toLocaleString('default', { month: 'long' }));
    this.generateMonthDays();
    this.generateWeekDays();
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
        label: this.daysOfWeek[i]
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
      if (newMonthIndex < 0) {
        this.currentYear--;
        this.currentMonth = 'Diciembre';
      } else {
        this.currentMonth = this.capitalizeFirstLetter(new Date(this.currentYear, newMonthIndex).toLocaleString('default', { month: 'long' }));
      }
      this.generateMonthDays();
    } else if (this.view === 'week') {
      this.currentWeekStart.setDate(this.currentWeekStart.getDate() - 7);
      this.generateWeekDays();
    } else {
      this.currentYear--;
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
    // Aquí puedes implementar la lógica para agendar la reunión
    console.log(`Reunión agendada para ${this.selectedDay} de ${this.selectedMonth} de ${this.selectedYear} a las ${this.selectedTime}`);
  }
}
