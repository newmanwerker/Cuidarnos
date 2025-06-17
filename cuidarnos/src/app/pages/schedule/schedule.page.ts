import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

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
  private toastController: ToastController,
  private router: Router,
  private iab: InAppBrowser
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
          hora: new Date(new Date(a.fecha_consulta).getTime() + 4 * 60 * 60 * 1000).toLocaleTimeString('es-CL', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
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

  // Abre en vista video-call (método más controlado)
  this.router.navigate(['/video-call'], {
    queryParams: { url: appointment.link_sala_medico }
  });

  // 👉 O si prefieres abrir directamente con InAppBrowser (opcional):
  // const browser = this.iab.create(appointment.link_sala_medico, '_system');
  // browser.show();
}

  async continueSession(appointment: any) {
    const toast = await this.toastController.create({
      message: `Reanudando sesión con ${appointment.paciente_nombre}...`,
      duration: 2000,
      color: 'primary',
      position: 'bottom'
    });
    await toast.present();
    this.router.navigate(['/video-call'], {
    queryParams: { url: appointment.link_sala_medico }
  });
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


  endSession(appointment: any) {
  this.http.put(`https://cuidarnos.up.railway.app/api/consultas/${appointment.id}/finalizar`, {})
    .subscribe({
      next: async (res) => {
        appointment.estado = 'terminada';

        const toast = await this.toastController.create({
          message: `Consulta con ${appointment.paciente_nombre} finalizada.`,
          duration: 2000,
          color: 'medium',
          position: 'bottom'
        });
        toast.present();
      },
      error: async (err) => {
        console.error('❌ Error al finalizar consulta:', err);
        const toast = await this.toastController.create({
          message: 'Error al finalizar consulta.',
          duration: 2000,
          color: 'danger',
          position: 'bottom'
        });
        toast.present();
      }
    });
}

  
}
