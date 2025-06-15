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

  constructor(private datePipe: DatePipe) {}

  ngOnInit() {
  const storedData = localStorage.getItem('userData');
    if (storedData) {
      const parsed = JSON.parse(storedData);
      const paciente = parsed.paciente;
      const ficha = paciente.ficha_medica;
      console.log('💊 Medicamentos recibidos:', paciente.medications);

      this.patient = {
        id: paciente.id,
        nombre: paciente.nombre,
        apellido: paciente.apellido,
        rut: paciente.rut,
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
        allergies: [],
        labResults: []
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
}

