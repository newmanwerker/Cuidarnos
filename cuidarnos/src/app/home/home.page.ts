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
    name: "Sebastian Rodriguez",
    id: "12345678",
    conditions: ["Hypertension", "Ulcerative Colitis"],
    medications: [
      { name: "Lisinopril", dosage: "10mg", frequency: "Once daily" },
      { name: "Mesalamine", dosage: "1000mg", frequency: "Twice daily" },
    ],
    appointments: [
      { date: "May 15, 2025", time: "10:00 AM", doctor: "Dr. Smith", type: "Check-up" },
      { date: "May 22, 2025", time: "2:30 PM", doctor: "Dr. Johnson", type: "Specialist" },
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
}