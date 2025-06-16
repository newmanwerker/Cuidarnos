import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-edit-patient-file',
  templateUrl: './edit-patient-file.page.html',
  styleUrls: ['./edit-patient-file.page.scss'],
  standalone: false
})
export class EditPatientFilePage implements OnInit {
  patientId: string = '';
  ficha: any = {};
  condiciones: any[] = [];
  alergias: any[] = [];
  medicamentos: any[] = [];
  receta: any = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.patientId = this.route.snapshot.paramMap.get('id') || '';
    this.cargarFichaCompleta();
  }

  cargarFichaCompleta() {
    this.http.get<any>(`https://cuidarnos.up.railway.app/api/pacientes/${this.patientId}/ficha-completa`)
      .subscribe({
        next: (data) => {
          this.ficha = data.ficha;
          this.condiciones = data.condiciones || [];
          this.alergias = data.alergias || [];
          this.medicamentos = data.medicamentos || [];
          this.receta = data.receta || null;
        },
        error: (err) => {
          console.error('❌ Error al cargar ficha:', err);
        }
      });
  }

  addCondicion() {
    // Lógica para abrir un modal o formulario de nueva condición
  }

  addAlergia() {
    // Lógica para abrir un modal o formulario de nueva alergia
  }

  addMedicamento() {
    // Lógica para abrir formulario o modal, y si no hay receta, crear una primero
  }

guardarCambios() {
  const payload = {
    contacto_emergencia: this.ficha.contacto_emergencia,
    parentezco_contacto: this.ficha.parentezco_contacto,
    altura: this.ficha.altura,
    peso: this.ficha.peso
  };

  this.http.put(`https://cuidarnos.up.railway.app/api/pacientes/${this.patientId}/ficha`, payload)
    .subscribe({
      next: (res) => {
        console.log('✅ Ficha actualizada correctamente:', res);
        // Puedes mostrar un mensaje visual con un toast
      },
      error: (err) => {
        console.error('❌ Error al guardar ficha del paciente:', err);
        // También podrías mostrar un mensaje de error
      }
    });
}

}
