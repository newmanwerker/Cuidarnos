import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
  standalone: false
})
export class SchedulePage implements OnInit {
  todayAppointments: any[] = [];
  doctorId: number = 0;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const stored = localStorage.getItem('userData');
    if (stored) {
      const parsed = JSON.parse(stored);
      this.doctorId = parsed.medico.id;

      this.http.get<any[]>(`https://cuidarnos.up.railway.app/api/consultas/hoy/${this.doctorId}`)
        .subscribe({
          next: (res) => {
            this.todayAppointments = res.map(apt => ({
              id: apt.id,
              patientName: apt.paciente_nombre,
              patientId: apt.paciente_id,
              time: new Date(apt.fecha_consulta).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
              type: apt.motivo_consulta,
              status: apt.estado === 'terminada' ? 'completed' : 'upcoming',
              duration: 30 // puedes ajustar si tienes este dato
            }));
          },
          error: (err) => {
            console.error('❌ Error al cargar citas del día:', err);
          }
        });
    }
  }

  getCurrentDate(): string {
    return new Date().toLocaleDateString('es-CL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getScheduleStatus(): string {
    const completed = this.todayAppointments.filter(a => a.status === 'completed').length;
    const total = this.todayAppointments.length;
    if (total === 0) return 'Sin Citas';
    if (completed === total) return 'Completado';
    if (completed === 0) return 'No Iniciado';
    return 'En progreso';
  }

  getStatusColor(): string {
    const status = this.getScheduleStatus();
    return status === 'Completado' ? 'success' : status === 'En progreso' ? 'warning' : 'medium';
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'completed': return 'checkmark-circle';
      case 'in-progress': return 'play-circle';
      case 'upcoming': return 'time';
      default: return 'time';
    }
  }

  getStatusIconColor(status: string): string {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'warning';
      case 'upcoming': return 'medium';
      default: return 'medium';
    }
  }

  async joinMeeting(appointment: any) {
    // Lógica real de videollamada
    appointment.status = 'in-progress';
  }

  async continueSession(appointment: any) {
    // Lógica real de continuar
  }

  viewNotes(appointment: any) {
    // Abrir notas
    console.log('Ver notas de:', appointment);
  }
}
