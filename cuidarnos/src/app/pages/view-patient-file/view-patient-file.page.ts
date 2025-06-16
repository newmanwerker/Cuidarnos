import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-view-patient-file',
  templateUrl: './view-patient-file.page.html',
  styleUrls: ['./view-patient-file.page.scss'],
  standalone: false
})
export class ViewPatientFilePage implements OnInit {
  patientId: string = '';
  ficha: any = {};
  condiciones: any[] = [];
  medicamentos: any[] = [];
  examenes: any[] = [];
  receta: any = null;
  alergias: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.patientId = this.route.snapshot.paramMap.get('id') || '';
    this.loadPatientData();
  }

  loadPatientData() {
    this.http.get<any>(`https://cuidarnos.up.railway.app/api/pacientes/${this.patientId}/ficha-completa`)
      .subscribe({
        next: (data) => {
          this.ficha = data.ficha;
          this.condiciones = data.condiciones || [];
          this.medicamentos = data.medicamentos || [];
          this.examenes = data.examenes || [];
          this.receta = data.receta || null;
          this.alergias = data.alergias || [];
        },
        error: (err) => {
          console.error('❌ Error al cargar ficha del paciente:', err);
        }
      });
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'No especificado';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  calculateAge(birthDate: string): number {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  }

  getSeverityColor(severity: string): string {
    switch (severity?.toLowerCase()) {
      case 'severa': return 'danger';
      case 'moderada': return 'warning';
      case 'leve': return 'success';
      default: return 'medium';
    }
  }

  toggleCondition(c: any) { c.expanded = !c.expanded; }
  toggleMedication(m: any) { m.expanded = !m.expanded; }

  editPatientFile() {
    this.router.navigate(['/edit-patient-file', this.patientId]);
  }
}
