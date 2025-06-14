import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-doctor-home',
  templateUrl: './doctor-home.page.html',
  styleUrls: ['./doctor-home.page.scss'],
  standalone: false
})
export class DoctorHomePage implements OnInit {
  doctor = {
    name: 'Maria Garcia',
    specialty: 'General Medicine',
    licenseNumber: 'ML-12345',
    status: 'Available'
  };

  todayAppointments = [
    { id: 1, patientName: 'Sebastian Rodriguez', time: '9:00 AM', type: 'Check-up', status: 'completed' },
    { id: 2, patientName: 'Ana Martinez', time: '9:30 AM', type: 'Follow-up', status: 'completed' },
    { id: 3, patientName: 'Carlos Perez', time: '10:00 AM', type: 'New Condition', status: 'upcoming' },
    { id: 4, patientName: 'Maria Lopez', time: '10:30 AM', type: 'Check-up', status: 'upcoming' },
    { id: 5, patientName: 'Juan Silva', time: '11:00 AM', type: 'Follow-up', status: 'upcoming' }
  ];

  completedAppointments = 2;
  upcomingAppointments = 3;
  emergencyAlerts = 1;

  constructor(private router: Router) { }

  ngOnInit() {
    this.calculateStats();
  }

  calculateStats() {
    this.completedAppointments = this.todayAppointments.filter(apt => apt.status === 'completed').length;
    this.upcomingAppointments = this.todayAppointments.filter(apt => apt.status === 'upcoming').length;
  }

  goToSchedule() {
    this.router.navigate(['/schedule']);
  }

  goToPatientSearch() {
    this.router.navigate(['/doctor/patient-search']);
  }

  goToPatientManagement() {
    console.log('Navigate to patient management');
    // this.router.navigate(['/doctor/patient-management']);
  }

  logout() {
    localStorage.removeItem('auth');
    localStorage.removeItem('paciente');
    localStorage.removeItem('userData');
    this.router.navigate(['/login']);
  }


}