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
  condicionEditando: any = null;
  agregandoAlergia: boolean = false;
  alergiaEditando: any = null;
  nuevaAlergia: any = {
    descripcion: '',
    severidad: '',
    causa: ''
  };

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
    notas: this.nuevaCondicion.notas,
    doctor_tratante_id: doctorId
  };

  // Si es edición
  if (this.condicionEditando) {
    this.http.put(`https://cuidarnos.up.railway.app/api/pacientes/condiciones/${this.condicionEditando.id}`, payload)
      .subscribe({
        next: (res: any) => {
          const index = this.condiciones.findIndex(c => c.id === this.condicionEditando.id);
          if (index !== -1) this.condiciones[index] = res.condicion;
          this.resetFormularioCondicion();
        },
        error: (err) => {
          console.error('❌ Error al editar condición:', err);
        }
      });
  } else {
    // Crear nueva
    this.http.post('https://cuidarnos.up.railway.app/api/pacientes/condiciones', payload)
      .subscribe({
        next: (res: any) => {
          this.condiciones.push(res.condicion);
          this.resetFormularioCondicion();
        },
        error: (err) => {
          console.error('❌ Error al guardar condición médica:', err);
        }
      });
  }
}


addAlergia() {
  this.agregandoAlergia = true;
  this.alergiaEditando = null;
  this.nuevaAlergia = {
    descripcion: '',
    severidad: '',
    causa: ''
  };
}

cancelarAgregarAlergia() {
  this.agregandoAlergia = false;
  this.alergiaEditando = null;
}

editarAlergia(alergia: any) {
  this.alergiaEditando = alergia;
  this.agregandoAlergia = true;
  this.nuevaAlergia = { ...alergia };
}

guardarAlergia() {
  const payload = {
    paciente_id: this.ficha.paciente_id,
    descripcion: this.nuevaAlergia.descripcion,
    severidad: this.nuevaAlergia.severidad,
    causa: this.nuevaAlergia.causa
  };

  if (this.alergiaEditando) {
    // Editar
    this.http.put(`https://cuidarnos.up.railway.app/api/pacientes/alergias/${this.alergiaEditando.id}`, payload)
      .subscribe({
        next: (res: any) => {
          const index = this.alergias.findIndex(a => a.id === this.alergiaEditando.id);
          if (index !== -1) this.alergias[index] = res.alergia;
          this.cancelarAgregarAlergia();
        },
        error: (err) => {
          console.error('❌ Error al editar alergia:', err);
        }
      });
  } else {
    // Crear
    this.http.post('https://cuidarnos.up.railway.app/api/pacientes/alergias', payload)
      .subscribe({
        next: (res: any) => {
          this.alergias.push(res.alergia);
          this.cancelarAgregarAlergia();
        },
        error: (err) => {
          console.error('❌ Error al guardar alergia:', err);
        }
      });
  }
}

eliminarAlergia(alergia: any) {
  if (!confirm('¿Deseas eliminar esta alergia?')) return;

  this.http.delete(`https://cuidarnos.up.railway.app/api/pacientes/alergias/${alergia.id}`)
    .subscribe({
      next: () => {
        this.alergias = this.alergias.filter(a => a.id !== alergia.id);
      },
      error: (err) => {
        console.error('❌ Error al eliminar alergia:', err);
      }
    });
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

  editarCondicion(condicion: any) {
  this.condicionEditando = condicion;
  this.agregandoCondicion = true;
  this.nuevaCondicion = { ...condicion };
}

eliminarCondicion(condicion: any) {
  if (!confirm('¿Estás seguro de eliminar esta condición médica?')) return;

  this.http.delete(`https://cuidarnos.up.railway.app/api/pacientes/condiciones/${condicion.id}`)
    .subscribe({
      next: () => {
        this.condiciones = this.condiciones.filter(c => c.id !== condicion.id);
      },
      error: (err) => {
        console.error('❌ Error al eliminar condición médica:', err);
      }
    });
}


resetFormularioCondicion() {
  this.agregandoCondicion = false;
  this.condicionEditando = null;
  this.nuevaCondicion = {
    nombre: '',
    severidad: '',
    estado: '',
    notas: ''
  };
}


}
