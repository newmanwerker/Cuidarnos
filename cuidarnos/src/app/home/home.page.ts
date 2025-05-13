import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone:false
})
export class HomePage implements OnInit {
  patient = {
    name: "Sebastian Ayala",
    id: "12345678",
    rut: "20.258.691-0",
    conditions: ["Hipertensión", "Colitis Ulcerosa"],
    medications: [
      { name: "Losartán", dosage: "50mg", frequency: "Cada 12 horas" },
      { name: "Mesalazina", dosage: "2000mg", frequency: "Cada 12 horas" },
      { name: "Amlodipino", dosage: "5mg",frequency: "Cada 24 horas" },
    ],
    appointments: [
      { date: "May 15, 2025", 
        time: "10:00 AM", 
        doctor: "Dra. Diaz", 
        type: "General",
        online: true 
      },
    ],
  };

  constructor(private router: Router) {}

  ngOnInit() {}

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