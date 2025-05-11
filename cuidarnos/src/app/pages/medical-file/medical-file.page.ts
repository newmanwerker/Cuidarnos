import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-medical-file',
  templateUrl: './medical-file.page.html',
  styleUrls: ['./medical-file.page.scss'],
  standalone: false
})
export class MedicalFilePage implements OnInit {
  patient = {
    name: 'Sebastian Rodriguez',
    id: '12345678',
    dateOfBirth: '15/04/1985',
    age: 40,
    height: 175,
    weight: 78,
    bloodType: 'O+',
    rut: '12.345.678-9',
    address: 'Av. Providencia 1234, Santiago',
    phone: '+56 9 1234 5678',
    email: 'sebastian.rodriguez@email.com',
    insurance: true,
    emergencyContact: {
      name: 'Maria Rodriguez',
      relation: 'Spouse',
      phone: '+56 9 8765 4321'
    },
    medicalConditions: [
      {
        name: 'Hypertension',
        diagnosisDate: '10/03/2018',
        treatingPhysician: 'Garcia',
        severity: 'Moderate',
        status: 'Controlled',
        notes: 'Patient has been maintaining blood pressure within normal ranges with medication. Regular monitoring required.',
        expanded: false
      },
      {
        name: 'Ulcerative Colitis',
        diagnosisDate: '22/07/2020',
        treatingPhysician: 'Martinez',
        severity: 'Moderate',
        status: 'In remission',
        notes: 'Patient experienced a flare-up in January 2023 but has been in remission since March 2023. Currently on maintenance therapy.',
        expanded: false
      }
    ],
    medications: [
      {
        name: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        startDate: '15/03/2018',
        endDate: null,
        prescribedBy: 'Garcia',
        purpose: 'Control hypertension',
        sideEffects: ['Dry cough'],
        notes: 'Take in the morning with food.',
        expanded: false
      },
      {
        name: 'Mesalamine',
        dosage: '1000mg',
        frequency: 'Twice daily',
        startDate: '25/07/2020',
        endDate: null,
        prescribedBy: 'Martinez',
        purpose: 'Maintain remission of ulcerative colitis',
        sideEffects: [],
        notes: 'Take with meals in the morning and evening.',
        expanded: false
      }
    ],
    allergies: [
      {
        name: 'Penicillin',
        severity: 'Severe',
        reaction: 'Anaphylaxis'
      },
      {
        name: 'Pollen',
        severity: 'Mild',
        reaction: 'Rhinitis, itchy eyes'
      }
    ],
    labResults: [
      {
        testName: 'Complete Blood Count',
        date: '10/04/2025',
        status: 'Normal'
      },
      {
        testName: 'Lipid Panel',
        date: '10/04/2025',
        status: 'Elevated LDL'
      },
      {
        testName: 'Kidney Function',
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