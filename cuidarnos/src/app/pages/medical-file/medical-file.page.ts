import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-medical-file',
  templateUrl: './medical-file.page.html',
  styleUrls: ['./medical-file.page.scss'],
  standalone: false,
  providers: [DatePipe]
})
export class MedicalFilePage implements OnInit {
  patient: any = {};
  recetaExpanded: boolean = false;

  constructor(private datePipe: DatePipe) {}

  ngOnInit() {
  const storedData = localStorage.getItem('userData');
    if (storedData) {
      const parsed = JSON.parse(storedData);
      const paciente = parsed.paciente;
      const ficha = paciente.ficha_medica;
      const receta = paciente.receta;
      console.log('💊 Medicamentos recibidos:', paciente.medications);

      this.patient = {
        id: paciente.id,
        nombre: paciente.nombre,
        apellido: paciente.apellido,
        rut: this.formatRut(paciente.rut),
        insurance: false,
        centro_salud: parsed.paciente.centro_salud,
        address: ficha?.direccion || '',
        phone: ficha?.celular || '',
        email: ficha?.email || '',
        dateOfBirth: this.datePipe.transform(ficha?.fecha_nac, 'dd \'de\' MMMM \'de\' yyyy', 'es') || '',
        age: ficha?.edad || '',
        height: ficha?.altura || '',
        weight: ficha?.peso || '',
        bloodType: ficha?.tipo_sangre || '',
        emergencyContact: {
          name: ficha?.contacto_emergencia || '',
          relation: ficha?.parentezco_contacto || '',
          phone: ficha?.celular || ''
        },
        medicalConditions: Array.isArray(ficha?.historial_medico)
          ? ficha.historial_medico.map((item: string) => ({
              name: item,
              diagnosisDate: 'N/A',
              treatingPhysician: 'Desconocido',
              severity: 'Moderada',
              status: 'En seguimiento',
              notes: '',
              expanded: false
            }))
          : [],
        receta: receta ?{
          fechaEmision: this.datePipe.transform(receta.fecha_emision, 'dd/MM/yyyy'),
          fechaTermino: this.datePipe.transform(receta.fecha_termino, 'dd/MM/yyyy'),
          observacion: receta.observacion || '',
        }: null,
        medications: Array.isArray(paciente?.medications)
        ? paciente.medications.map((m: any) => ({
            name: m.nombre,
            dosage: m.dosis,
            frequency: m.frecuencia,
            startDate: this.datePipe.transform(m.fecha_inicio, 'dd/MM/yyyy') || '',
            endDate: this.datePipe.transform(m.fecha_termino, 'dd/MM/yyyy') || '',
            prescribedBy: m.medico_nombre && m.medico_apellido
            ? `${m.medico_nombre} ${m.medico_apellido}`
            : 'Desconocido',
            purpose: '',
            sideEffects: [],
            notes: '',
            expanded: false
          }))
        : [],
        allergies: Array.isArray(paciente?.alergias)
          ? paciente.alergias.map((a: any) => ({
              description: a.descripcion,
              severity: a.severidad,
              cause: a.causa,
              expanded: false
          })): [],
        labResults: Array.isArray(paciente.labResults)
        ? paciente.labResults.map((r: any) => ({
            description: r.descripcion,
            file: r.archivo_pdf,
            date: this.datePipe.transform(r.fecha, 'dd/MM/yyyy') || '',
            expanded: false
          })):[],
      };

      console.log('✅ Paciente procesado:', this.patient);
    } else {
      console.warn('⚠️ No se encontró userData en localStorage');
    }
  }

  toggleCondition(condition: any) {
    condition.expanded = !condition.expanded;
  }

  toggleMedication(medication: any) {
    medication.expanded = !medication.expanded;
  }
  getSucursal(): string {
    return this.patient?.centro_salud || 'No Data';
  }



formatRut(rut: string): string {
  if (!rut) return '';

  // Eliminar puntos y guion
  rut = rut.replace(/\./g, '').replace('-', '');

  const body = rut.slice(0, -1);
  const dv = rut.slice(-1);

  let formatted = '';
  let count = 0;

  for (let i = body.length - 1; i >= 0; i--) {
    formatted = body[i] + formatted;
    count++;
    if (count % 3 === 0 && i !== 0) {
      formatted = '.' + formatted;
    }
  }

  return `${formatted}-${dv}`;
}



}

