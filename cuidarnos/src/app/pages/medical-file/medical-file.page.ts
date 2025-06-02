import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-medical-file',
  templateUrl: './medical-file.page.html',
  styleUrls: ['./medical-file.page.scss'],
  standalone: false
})
export class MedicalFilePage implements OnInit {
  patient = {
    name: 'Sebastian Rodrigues',
    id: '12345675',
    dateOfBirth: '15/04/1985',
    age: 40,
    height: 175,
    weight: 78,
    bloodType: 'O+',
    rut: '12.345.678-9',
    address: 'Av. Providencia 1234, Santiago',
    phone: '+56 9 1234 5678',
    email: 'sebastian.ayala@gmail.com',
    insurance: false,
    emergencyContact: {
      name: 'Claudia Santos',
      relation: 'Madre',
      phone: '+56 9 8765 4321'
    },
    medicalConditions: [
      {
        name: 'Hipertensión',
        diagnosisDate: '10/03/2018',
        treatingPhysician: 'Garcia',
        severity: 'Moderada',
        status: 'Controlada',
        notes: 'El paciente se ha mantenido con una presión arterial normal con uso de medicamentos.',
        expanded: false
      },
      {
        name: 'Colitis Ulcerosa',
        diagnosisDate: '22/07/2020',
        treatingPhysician: 'Martinez',
        severity: 'Moderada',
        status: 'En remisión',
        notes: 'Paciente en remisión con uso de mesalamina.',
        expanded: false
      }
    ],
    medications: [
      {
        name: 'Losartán',
        dosage: '50mg',
        frequency: 'Cada 12 horas',
        startDate: '15/03/2018',
        endDate: null,
        prescribedBy: 'Garcia',
        purpose: 'Controlar hipertensión',
        sideEffects: ['Mareos, fatiga'],
        notes: 'Consumir en la mañana, con comida.',
        expanded: false
      },
      {
        name: 'Mesalazina',
        dosage: '2000mg',
        frequency: 'Cada 12 horas',
        startDate: '25/07/2020',
        endDate: null,
        prescribedBy: 'Martinez',
        purpose: 'Mantener en remisión colitis ulcerosa',
        sideEffects: [],
        notes: 'Tomar con comidas en la mañana y noche.',
        expanded: false
      }
    ],
    allergies: [
      {
        name: 'Penicilina',
        severity: 'Severa',
        reaction: 'Anafilaxis'
      },
      {
        name: 'Pollen',
        severity: 'Leve',
        reaction: 'Rinitis, picazón en ojos'
      }
    ],
    labResults: [
      {
        testName: 'Hemograma Completo',
        date: '10/04/2025',
        status: 'Normal'
      },
      {
        testName: 'Panel Lipídico',
        date: '10/04/2025',
        status: 'LDL Elevado'
      },
      {
        testName: 'Función Hepática',
        date: '10/04/2025',
        status: 'Normal'
      }
    ]
  };

  constructor() { }

  ngOnInit() {
  }

  toggleCondition(condition: any) {
    condition.expanded = !condition.expanded;
  }

  toggleMedication(medication: any) {
    medication.expanded = !medication.expanded;
  }
}