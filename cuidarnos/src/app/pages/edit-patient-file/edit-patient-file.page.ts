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

  agregandoCondicion: boolean = false;
  nuevaCondicion: any = {
    nombre: '',
    severidad: '',
    estado: '',
    notas: ''
  };

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
    this.agregandoCondicion = true;
    this.nuevaCondicion = {
      nombre: '',
      severidad: '',
      estado: '',
      notas: ''
    };
  }

  cancelarAgregarCondicion() {
    this.agregandoCondicion = false;
  }

  guardarCondicion() {
    const usuario = this.authService.getUsuario();
    const doctorId = usuario?.id;

    const payload = {
      ficha_paciente_id: this.ficha.id,
      nombre: this.nuevaCondicion.nombre,
      severidad: this.nuevaCondicion.severidad,
      estado: this.nuevaCondicion.estado,
      notas: this.nuevaCondicion.notes,
      doctor_tratante_id: doctorId
    };

    this.http.post('https://cuidarnos.up.railway.app/api/pacientes/condiciones', payload)
      .subscribe({
        next: (res: any) => {
          console.log('✅ Condición médica guardada:', res);
          this.condiciones.push(res.condicion);
          this.agregandoCondicion = false;
        },
        error: (err) => {
          console.error('❌ Error al guardar condición médica:', err);
        }
      });
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
        next: async (res) => {
          console.log('✅ Ficha actualizada correctamente:', res);

          const alert = document.createElement('ion-alert');
          alert.header = 'Ficha actualizada';
          alert.message = 'Los datos del paciente fueron guardados correctamente.';
          alert.buttons = [{
            text: 'OK',
            handler: () => {
              this.router.navigate(['/patient-search']);
            }
          }];

          document.body.appendChild(alert);
          await alert.present();
        },
        error: (err) => {
          console.error('❌ Error al guardar ficha del paciente:', err);
        }
      });
  }
}
