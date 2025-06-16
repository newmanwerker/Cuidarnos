import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'; 

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

  constructor(private router: Router, private http: HttpClient) {}
  totalAppointments = 0;
  totalPatients = 0;

ngOnInit() {
  const stored = localStorage.getItem('userData');
  if (stored) {
    const parsed = JSON.parse(stored);
    const medico = parsed.medico;

    this.doctor = {
      name: `Dr. ${medico.nombre} ${medico.apellido || ''}`,
      specialty: medico.especialidad,
      centro: medico.centro_salud || 'Centro Desconocido',
      id: medico.id,
      status: 'Disponible'
    };

    this.loadTodayStats(medico.id);
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
    this.router.navigate(['/patient-search']);
  }

  goToPatientManagement() {
    this.router.navigate(['/doctor/patient-management']);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  loadTodayStats(medicoId: number) {
  this.http.get<any>('https://cuidarnos.up.railway.app/api/consultas/doctor/hoy', {
    params: { medicoId: medicoId.toString() }
  }).subscribe({
    next: (res) => {
      this.totalAppointments = res.total;
      this.completedAppointments = res.completadas;
    },
    error: (err) => {
      console.error('❌ Error al cargar estadísticas del día:', err);
    }
  });
}

}
