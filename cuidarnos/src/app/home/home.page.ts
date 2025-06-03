import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone:false
})
export class HomePage implements OnInit {
  patient: any = null;

  constructor(private router: Router) {}

  ngOnInit() {
    const storedPatient = localStorage.getItem('paciente');
    if (storedPatient) {
      this.patient = JSON.parse(storedPatient);
    } else {
      this.router.navigate(['/login']);
    }
  }

  getFullName(): string{
    if (!this.patient) return '';
    return `${this.patient.nombre} ${this.patient.apellido}`;
  }

  getMonth(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('default', { month: 'short' });
  }

  getDay(dateString: string): string {
    const date = new Date(dateString);
    return date.getDate().toString();
  }

  goToMedicalFile() {
    this.router.navigate(['/medical-file']);
  }

  goToBooking() {
    this.router.navigate(['/booking']);
  }

  goToSettings() {
    this.router.navigate(['/settings']);
  }

  goToAccessibility() {
  this.router.navigate(['/accessibility']);
  }

  goToCall(){
    this.router.navigate(['/video-call']);
  }
}