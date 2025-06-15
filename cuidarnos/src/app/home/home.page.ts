import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone:false
})
export class HomePage implements OnInit {
  patient: any = null;

  constructor(private router: Router) {}

  ngOnInit() {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const parsed = JSON.parse(storedUserData);
      const paciente = parsed.paciente;
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
      console.log('✅ Datos del paciente:', this.patient);
      console.log('💊 Medicamentos cargados:', this.patient.medications);
    } else {
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
}