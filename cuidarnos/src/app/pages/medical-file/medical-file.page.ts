import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-medical-file',
  templateUrl: './medical-file.page.html',
  styleUrls: ['./medical-file.page.scss'],
  standalone: false
})
export class MedicalFilePage implements OnInit {
  patient: any = {};

  constructor() {}

  ngOnInit() {
  const storedData = localStorage.getItem('userData');
    if (storedData) {
      const parsed = JSON.parse(storedData);
      const paciente = parsed.paciente;
      const ficha = paciente.ficha_medica;

      this.patient = {
        id: paciente.id,
        nombre: paciente.nombre,
        apellido: paciente.apellido,
        rut: paciente.rut,
        insurance: false,
        centro_salud: parsed.centro_salud,
        address: ficha?.direccion || '',
        phone: ficha?.celular || '',
        email: ficha?.email || '',
        dateOfBirth: ficha?.fecha_nac || '',
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
        medications: [],
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
}