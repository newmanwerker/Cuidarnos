import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false
})
export class HomePage {
  patient: any = null;

  constructor(private router: Router) {}

  ionViewWillEnter() {
    this.loadPacienteData();
  }

  loadPacienteData() {
    const storedUserData = localStorage.getItem('userData');

    if (!storedUserData) {
      console.warn('No hay datos en localStorage, redirigiendo al login...');
      this.router.navigate(['/login']);
      return;
    }

    try {
      const parsed = JSON.parse(storedUserData);
      const paciente = parsed.paciente;

      if (!paciente) {
        console.warn('No se encontró el objeto paciente en los datos.');
        this.router.navigate(['/login']);
        return;
      }

      const ficha = paciente.ficha_medica;

      this.patient = {
        ...paciente,
        centro_salud: paciente.centro_salud,
        ficha_medica: ficha || {},
        medications: Array.isArray(paciente.medications)
          ? paciente.medications.map((m: any) => ({
              name: m.nombre,
              dosage: m.dosis,
              frequency: m.frecuencia,
              startDate: m.fecha_inicio || '',
              endDate: m.fecha_termino || '',
              prescribedBy: m.medico_nombre || 'Desconocido'
            }))
          : [],
        appointments: Array.isArray(paciente.appointments) ? paciente.appointments : []
      };
    } catch (e) {
      console.error('Error al parsear userData:', e);
      this.router.navigate(['/login']);
    }
  }

  getFullName(): string{
    if (!this.patient) return '';
    return `${this.patient.nombre} ${this.patient.apellido}`;
  }

  getSucursal(): string {
    return this.patient?.centro_salud || 'No Data';
  }

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

  isToday(dateStr: string): boolean {
  const today = new Date();
  const date = new Date(dateStr);
  return (
    today.getFullYear() === date.getFullYear() &&
    today.getMonth() === date.getMonth() &&
    today.getDate() === date.getDate()
  );
}
  logout() {
    localStorage.removeItem('auth');
    localStorage.removeItem('paciente');
    localStorage.removeItem('userData');
    this.router.navigate(['/login']);
  }

getFormattedHour(dateStr: string): string {
  // Extrae solo la parte de la hora (HH:MM)
  const hora = dateStr.split('T')[1]?.slice(0, 5); // "08:00"
  return hora ?? 'Hora inválida';
}

}