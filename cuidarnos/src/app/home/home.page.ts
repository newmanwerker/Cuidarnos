import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {
  patient: any;

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const usuario = this.authService.getUsuario();

    if (!usuario || !usuario.id) {
      console.warn('⚠️ No hay sesión activa');
      this.router.navigate(['/login']);
      return;
    }

    // Cargar datos actualizados desde el backend
    this.http.get<any>(`https://cuidarnos.up.railway.app/api/pacientes/${usuario.id}/ficha-completa`)
      .subscribe({
        next: (res) => {
        this.patient = {
          ...usuario,
          ficha_medica: res.ficha,
          medications: res.medicamentos,
          receta: res.receta,
          allergies: res.alergias,
          labResults: res.examenes,
          condiciones: res.condiciones // <-- Agregado
        };
        },
        error: (err) => {
          console.error('❌ Error al cargar datos actualizados del paciente:', err);
        }
      });
  }

  getFullName() {
    return `${this.patient?.nombre || ''} ${this.patient?.apellido || ''}`;
  }

  getSucursal() {
    return this.patient?.centro_salud?.nombre || this.patient?.centro_salud || 'No definida';
  }

  getMonth(date: string): string {
    return new Date(date).toLocaleDateString('es-CL', { month: 'short' });
  }

  getDay(date: string): string {
    return new Date(date).getDate().toString();
  }

 getFormattedHour(date: string): string {
  const original = new Date(date);
  const adjusted = new Date(original.getTime() + 4 * 60 * 60 * 1000); // +4 horas
  return adjusted.toLocaleTimeString('es-CL', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

goToCall(link: string) {
  this.router.navigate(['/video-call'], { queryParams: { url: link } });
}
  goToMedicalFile() {
    this.router.navigate(['/medical-file']);
  }

  goToBooking() {
    this.router.navigate(['/booking']);
  }

  goToAccessibility() {
    this.router.navigate(['/accessibility']);
  }

  goToSettings() {
    this.router.navigate(['/settings']);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
