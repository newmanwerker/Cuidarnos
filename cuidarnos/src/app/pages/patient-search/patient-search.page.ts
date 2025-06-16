import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patient-search',
  templateUrl: './patient-search.page.html',
  styleUrls: ['./patient-search.page.scss'],
  standalone: false
})
export class PatientSearchPage implements OnInit {
  searchTerm: string = '';
  allPatients: any[] = [];
  filteredPatients: any[] = [];
  centroSaludId: number = 0;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const usuario = this.authService.getUsuario();
    console.log('👤 Usuario cargado:', usuario);

    this.centroSaludId = usuario?.centro_salud?.id || usuario?.id_centro_salud;

    if (!this.centroSaludId) {
      console.warn('⚠️ Usuario sin centro de salud asignado');
      return;
    }

    this.loadAllPatients();
  }

  loadAllPatients() {
    this.http.get<any[]>(`https://cuidarnos.up.railway.app/api/pacientes/centro/${this.centroSaludId}`)
      .subscribe({
        next: (data) => {
          this.allPatients = data;
          this.filteredPatients = data;
        },
        error: (err) => {
          console.error('❌ Error al cargar pacientes:', err);
        }
      });
  }

  onSearchInput(event: any) {
    const value = event.target.value.trim().toLowerCase();
    this.searchTerm = value;

    if (!value) {
      this.filteredPatients = this.allPatients;
      return;
    }

    this.filteredPatients = this.allPatients.filter(p =>
      p.nombre.toLowerCase().includes(value) ||
      p.apellido.toLowerCase().includes(value) ||
      p.rut.toLowerCase().includes(value)
    );
  }

  viewPatientFile(patient: any) {
    this.router.navigate(['/view-patient-file', patient.id]);
  }

  editPatientFile(patient: any) {
    this.router.navigate(['/edit-patient-file', patient.id]);
  }
}
