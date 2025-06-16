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
  filteredPatients: any[] = [];

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {}

  onSearchInput(event: any) {
    const value = event.target.value.trim();
    this.searchTerm = value;

    if (value.length < 2) {
      this.filteredPatients = [];
      return;
    }

      const usuario = this.authService.getUsuario();
      console.log('👤 Usuario cargado:', usuario);

const centroSaludId = usuario?.centro_salud?.id || usuario?.id_centro_salud;

if (!centroSaludId) {
  console.warn('⚠️ Usuario sin centro de salud asignado');
  return;
}


    this.http.get<any[]>('https://cuidarnos.up.railway.app/api/pacientes/busqueda', {
      params: {
        centroSaludId: centroSaludId.toString(),
        query: value
      }
    }).subscribe({
      next: (data) => {
        this.filteredPatients = data;
      },
      error: (err) => {
        console.error('❌ Error al buscar pacientes:', err);
        this.filteredPatients = [];
      }
    });
  }

  viewPatientFile(patient: any) {
    this.router.navigate(['/doctor/view-patient', patient.id]);
  }

  editPatientFile(patient: any) {
    this.router.navigate(['/doctor/edit-patient', patient.id]);
  }
}
