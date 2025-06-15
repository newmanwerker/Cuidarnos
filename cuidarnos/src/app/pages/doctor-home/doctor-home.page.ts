import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-doctor-home',
  templateUrl: './doctor-home.page.html',
  styleUrls: ['./doctor-home.page.scss'],
  standalone: false
})
export class DoctorHomePage implements OnInit {
  doctor: any = null;
  todayAppointments: any[] = [];
  completedAppointments = 0;
  upcomingAppointments = 0;

  constructor(private router: Router) {}

  ngOnInit() {
    const stored = localStorage.getItem('userData');
    if (stored) {
      const parsed = JSON.parse(stored);
      this.doctor = {
        name: `${parsed.medico.nombre} ${parsed.medico.apellido || ''}`,
        specialty: parsed.medico.especialidad || 'General',
        centro: parsed.medico.centro_salud || 'Centro Desconocido',
        status: 'Disponible' // puedes cambiar según lógica real
      };

      // Cargar sus citas de hoy si ya las tienes
      this.todayAppointments = parsed.medico.appointments || [];

      this.calculateStats();
    } else {
      this.router.navigate(['/login']);
    }
  }

  calculateStats() {
    this.completedAppointments = this.todayAppointments.filter(a => a.status === 'completed').length;
    this.upcomingAppointments = this.todayAppointments.filter(a => a.status === 'upcoming').length;
  }

  goToSchedule() {
    this.router.navigate(['/schedule']);
  }

  goToPatientSearch() {
    this.router.navigate(['/doctor/patient-search']);
  }

  goToPatientManagement() {
    this.router.navigate(['/doctor/patient-management']);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
