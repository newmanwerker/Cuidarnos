import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patient-search',
  templateUrl: './patient-search.page.html',
  styleUrls: ['./patient-search.page.scss'],
  standalone: false
})
export class PatientSearchPage implements OnInit {
  searchTerm: string = '';
  
  searchFilters = [
    { name: 'Active Patients', icon: 'checkmark-circle', active: false, key: 'active' },
    { name: 'Recent Visits', icon: 'time', active: false, key: 'recent' },
    { name: 'Chronic Conditions', icon: 'medical', active: false, key: 'chronic' }
  ];

  allPatients = [
    {
      id: '12345678',
      firstName: 'Sebastian',
      lastName: 'Rodriguez',
      age: 40,
      phone: '+56 9 1234 5678',
      email: 'sebastian.rodriguez@email.com',
      conditions: ['Hypertension', 'Ulcerative Colitis'],
      status: 'Active',
      lastVisit: '2025-05-10'
    },
    {
      id: '87654321',
      firstName: 'Ana',
      lastName: 'Martinez',
      age: 35,
      phone: '+56 9 8765 4321',
      email: 'ana.martinez@email.com',
      conditions: ['Diabetes Type 2'],
      status: 'Active',
      lastVisit: '2025-05-08'
    },
    {
      id: '11223344',
      firstName: 'Carlos',
      lastName: 'Perez',
      age: 28,
      phone: '+56 9 1122 3344',
      email: 'carlos.perez@email.com',
      conditions: [],
      status: 'Active',
      lastVisit: '2025-05-05'
    },
    {
      id: '55667788',
      firstName: 'Maria',
      lastName: 'Lopez',
      age: 45,
      phone: '+56 9 5566 7788',
      email: 'maria.lopez@email.com',
      conditions: ['Asthma', 'Allergic Rhinitis'],
      status: 'Inactive',
      lastVisit: '2025-04-20'
    },
    {
      id: '99887766',
      firstName: 'Juan',
      lastName: 'Silva',
      age: 52,
      phone: '+56 9 9988 7766',
      email: 'juan.silva@email.com',
      conditions: ['Hypertension', 'High Cholesterol', 'Obesity'],
      status: 'Active',
      lastVisit: '2025-05-12'
    }
  ];

  filteredPatients: any[] = [];

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onSearchInput(event: any) {
    this.searchTerm = event.target.value;
    this.filterPatients();
  }

  filterPatients() {
    if (!this.searchTerm.trim()) {
      this.filteredPatients = [];
      return;
    }

    const searchLower = this.searchTerm.toLowerCase();
    
    this.filteredPatients = this.allPatients.filter(patient => {
      const matchesSearch = 
        patient.firstName.toLowerCase().includes(searchLower) ||
        patient.lastName.toLowerCase().includes(searchLower) ||
        patient.id.includes(searchLower) ||
        patient.phone.includes(searchLower) ||
        patient.email.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;

      // Apply active filters
      const activeFilters = this.searchFilters.filter(f => f.active);
      if (activeFilters.length === 0) return true;

      return activeFilters.some(filter => {
        switch (filter.key) {
          case 'active':
            return patient.status === 'Active';
          case 'recent':
            const lastVisit = new Date(patient.lastVisit);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return lastVisit >= weekAgo;
          case 'chronic':
            return patient.conditions.length > 0;
          default:
            return true;
        }
      });
    });
  }

  toggleFilter(filter: any) {
    filter.active = !filter.active;
    this.filterPatients();
  }

  editPatientFile(patient: any) {
    // Navigate to patient file editor
    this.router.navigate(['/doctor/edit-patient', patient.id]);
  }

  viewPatientFile(patient: any) {
    // Navigate to read-only patient file view
    this.router.navigate(['/doctor/view-patient', patient.id]);
  }
}