import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
  standalone: false
})
export class SchedulePage implements OnInit {
  todayAppointments: any[] = [];

  constructor(
    private http: HttpClient,
    private toastController: ToastController
  ) {}

ngOnInit() {
  const stored = localStorage.getItem('userData');
  if (stored) {
    const parsed = JSON.parse(stored);
    const medicoId = parsed.medico.id;

    this.http.get<any[]>(`https://cuidarnos.up.railway.app/api/consultas/hoy/${medicoId}`).subscribe({
      next: (data) => {
        this.todayAppointments = data.map((a: any) => ({
          ...a,
          hora: new Date(a.fecha_consulta).toLocaleTimeString('es-CL', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: 'America/Santiago' // ✅ Correcta conversión
          })
        }));
      },
      error: (err) => {
        console.error('❌ Error al obtener consultas de hoy:', err);
      }
    });
  }
}


  getCurrentDate(): string {
    return formatDate(new Date(), 'EEEE d \'de\' MMMM \'de\' y', 'es-CL');
  }

  getScheduleStatus(): string {
    const total = this.todayAppointments.length;
    const completadas = this.todayAppointments.filter(a => a.estado === 'terminada').length;

    if (total === 0) return 'Sin Consultas';
    if (completadas === total) return 'Todas Terminadas';
    if (completadas === 0) return 'No Iniciadas';
    return 'En Proceso';
  }

  getStatusColor(): string {
    const total = this.todayAppointments.length;
    const completadas = this.todayAppointments.filter(a => a.estado === 'terminada').length;

    if (total === 0) return 'medium';
    if (completadas === total) return 'success';
    if (completadas === 0) return 'danger';
    return 'warning';
  }

  async joinMeeting(appointment: any) {
    const toast = await this.toastController.create({
      message: `Ingresando a reunión con ${appointment.paciente_nombre}...`,
      duration: 2000,
      color: 'success',
      position: 'bottom'
    });
    await toast.present();

    appointment.estado = 'en curso';
  }

  async continueSession(appointment: any) {
    const toast = await this.toastController.create({
      message: `Reanudando sesión con ${appointment.paciente_nombre}...`,
      duration: 2000,
      color: 'primary',
      position: 'bottom'
    });
    await toast.present();
  }

  viewNotes(appointment: any) {
    console.log('🔍 Ver notas de la consulta:', appointment);
    // Aquí podrías navegar a una vista o abrir un modal
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'terminada': return 'checkmark-circle';
      case 'en curso': return 'play-circle';
      case 'pendiente': return 'time';
      default: return 'help-circle';
    }
  }

  getStatusIconColor(status: string): string {
    switch (status) {
      case 'terminada': return 'success';
      case 'en curso': return 'warning';
      case 'pendiente': return 'medium';
      default: return 'medium';
    }
  }
}
