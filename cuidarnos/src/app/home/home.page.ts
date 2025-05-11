import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  patient = {
    name: "Sebastian Rodriguez",
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

  constructor() {}

  ngOnInit() {}
}