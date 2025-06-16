import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-medical-file',
  templateUrl: './medical-file.page.html',
  styleUrls: ['./medical-file.page.scss'],
  standalone: false,
  providers: [DatePipe]
})
export class MedicalFilePage implements OnInit {
  patient: any = {};
  recetaExpanded = false;

  constructor(private http: HttpClient, private datePipe: DatePipe) {}

  ngOnInit() {
    const stored = localStorage.getItem('userData');
    const id = stored ? JSON.parse(stored).paciente?.id : null;

    if (!id) {
      console.warn('⚠️ No se encontró ID del paciente');
      return;
    }

    this.http.get<any>(`https://cuidarnos.up.railway.app/api/pacientes/${id}/ficha-completa`).subscribe({
      next: (res) => {
        const ficha = res.ficha || {};
        const receta = res.receta || null;

        this.patient = {
          id: ficha.paciente_id,
          nombre: ficha.nombre,
          apellido: ficha.apellido,
          rut: this.formatRut(ficha.rut),
          centro_salud: ficha.centro_salud_id,
          address: ficha.direccion,
          phone: ficha.celular,
          email: ficha.email,
          dateOfBirth: this.datePipe.transform(ficha.fecha_nac, 'dd \'de\' MMMM \'de\' yyyy', 'es') || '',
          age: ficha.edad,
          height: ficha.altura,
          weight: ficha.peso,
          bloodType: ficha.tipo_sangre,
          emergencyContact: {
            name: ficha.contacto_emergencia,
            relation: ficha.parentezco_contacto,
            phone: ficha.celular
          },
          medicalConditions: Array.isArray(res.condiciones)
            ? res.condiciones.map((c: any) => ({
                name: c.nombre,
                treatingPhysician: `${c.nombre_doctor_tratante} ${c.apellido_doctor_tratante}`,
                severity: c.severidad,
                status: c.estado,
                notes: c.notas || '',
                expanded: false
              }))
            : [],
          receta: receta ? {
            fechaEmision: this.datePipe.transform(receta.fecha_emision, 'dd/MM/yyyy'),
            fechaTermino: this.datePipe.transform(receta.fecha_termino, 'dd/MM/yyyy'),
            observacion: receta.observacion
          } : null,
          medications: Array.isArray(res.medicamentos)
            ? res.medicamentos.map((m: any) => ({
                name: m.nombre,
                dosage: m.dosis,
                frequency: m.frecuencia,
                startDate: this.datePipe.transform(m.fecha_inicio, 'dd/MM/yyyy'),
                endDate: this.datePipe.transform(m.fecha_termino, 'dd/MM/yyyy'),
                prescribedBy: `${m.medico_nombre} ${m.medico_apellido}`,
                purpose: '',
                sideEffects: [],
                notes: '',
                expanded: false
              }))
            : [],
          allergies: Array.isArray(res.alergias)
            ? res.alergias.map((a: any) => ({
                description: a.descripcion,
                severity: a.severidad,
                cause: a.causa,
                expanded: false
              }))
            : [],
          labResults: Array.isArray(res.examenes)
            ? res.examenes.map((e: any) => ({
                description: e.descripcion,
                file: e.archivo_pdf,
                date: this.datePipe.transform(e.fecha, 'dd/MM/yyyy'),
                expanded: false
              }))
            : []
        };

        console.log('📋 Datos completos del paciente:', this.patient);
      },
      error: (err) => {
        console.error('❌ Error al obtener ficha médica:', err);
        this.patient = {}; // previene errores en el HTML
      }
    });
  }

  toggleCondition(condition: any) {
    condition.expanded = !condition.expanded;
  }

  toggleMedication(med: any) {
    med.expanded = !med.expanded;
  }

  formatRut(rut: string): string {
    if (!rut) return '';
    rut = rut.replace(/\./g, '').replace('-', '');
    const body = rut.slice(0, -1);
    const dv = rut.slice(-1);
    let formatted = '';
    for (let i = body.length - 1, j = 0; i >= 0; i--, j++) {
      formatted = body[i] + formatted;
      if (j % 3 === 2 && i !== 0) formatted = '.' + formatted;
    }
    return `${formatted}-${dv}`;
  }
}
