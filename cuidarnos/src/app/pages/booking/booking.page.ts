import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service'; // Adjust the path as necessary

@Component({
  selector: 'app-booking',
  templateUrl: './booking.page.html',
  styleUrls: ['./booking.page.scss'],
  standalone:false
})
export class BookingPage implements OnInit {
  currentStep = 1;
  
  // Step 1: Specialties
  specialties = [
    { id: 1, name: 'Medicina General', icon: 'fitness' },
  ];
  selectedSpecialty: number | null = null;
  
  // Step 2: Doctors
doctors = [] as {
  id: number;
  name: string;
  specialty: string;
  specialtyId: number;
  nextAvailable: string;
}[];
  filteredDoctors: any[] = [];
  selectedDoctor: number | null = null;
  availableDates: string[] = [];
  
  // Step 3: Date and Time
  currentDate = new Date();
  currentYear = this.currentDate.getFullYear();
  currentMonth = this.currentDate.getMonth();
  currentMonthName = '';
  weekdays = ['Dom', 'Lun', 'Mar', 'Mier', 'Jue', 'Vie', 'Sab'];
  calendarDays: any[] = [];
  selectedDate: string | null = null;
  
  availableTimeSlots: string[] = [];
  selectedTimeSlot: string | null = null;
  
  appointmentTypes = [
    { id: 1, name: 'Revisión General', duration: 30, icon: 'clipboard' },
    { id: 2, name: 'Seguimiento', duration: 15, icon: 'repeat' },
  ];
  selectedAppointmentType: number | null = null;
  
  // Step 4: Confirmation
  appointmentNotes: string = '';

  constructor(
    private router: Router,
    private toastController: ToastController,
    private http: HttpClient,
    private authService: AuthService
  ) { }

ngOnInit() {
  this.doctors = [];
  this.filteredDoctors = [];
  this.selectedDoctor = null;
  this.updateCalendar();
  this.updateMonthName();
   this.http.get<string[]>('https://cuidarnos.up.railway.app/api/dias-disponibles').subscribe({
    next: (fechas) => {
      this.availableDates = fechas;
      this.updateCalendar(); // Espera a tener availableDates antes de construir el calendario
      this.updateMonthName();
    },
    error: (err) => {
      console.error('❌ Error al obtener fechas disponibles:', err);
    }
  });
}

  // Step Navigation
  nextStep() {
    if (this.canProceed()) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  canProceed(): boolean {
    switch (this.currentStep) {
      case 1:
        return this.selectedSpecialty !== null;
      case 2:
        return this.selectedDoctor !== null;
      case 3:
        return this.selectedDate !== null && 
               this.selectedTimeSlot !== null && 
               this.selectedAppointmentType !== null;
      default:
        return true;
    }
  }

  // Step 1: Specialty Selection
  selectSpecialty(specialtyId: number) {
    this.selectedSpecialty = specialtyId;
  }

  // Step 2: Doctor Selection
  filterDoctorsBySpecialty() {
    this.filteredDoctors = this.doctors.filter(
      doctor => doctor.specialtyId === this.selectedSpecialty
    );
  }

  selectDoctor(doctorId: number) {
    this.selectedDoctor = doctorId;
  }

  // Step 3: Date and Time Selection
  updateMonthName() {
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    this.currentMonthName = monthNames[this.currentMonth];
  }

  updateCalendar() {
    this.calendarDays = [];
    
    // Get first day of the month
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const startingDay = firstDay.getDay();
    
    // Get last day of the month
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    const totalDays = lastDay.getDate();
    
    // Get last day of previous month
    const prevMonthLastDay = new Date(this.currentYear, this.currentMonth, 0).getDate();
    
    // Fill in days from previous month
    for (let i = startingDay - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i;
      const date = new Date(this.currentYear, this.currentMonth - 1, day);
      this.calendarDays.push({
        dayNumber: day,
        date: date,
        currentMonth: false,
        available: false
      });
    }
    
    // Fill in days of current month
    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(this.currentYear, this.currentMonth, i);
      const today = new Date();
      
      // Check if date is in the past
      const isPast = date < new Date(today.setHours(0, 0, 0, 0));
      
      // Check if it's a weekend
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      
      // Determine availability (not in past and not weekend)
      const available = !isPast && !isWeekend;
      
      this.calendarDays.push({
        dayNumber: i,
        date: date,
        currentMonth: true,
        available: available
      });
    }
    
    // Calculate how many days from next month to show
    const totalCells = Math.ceil((startingDay + totalDays) / 7) * 7;
    const nextMonthDays = totalCells - (startingDay + totalDays);
    
    // Fill in days from next month
    for (let i = 1; i <= nextMonthDays; i++) {
      const date = new Date(this.currentYear, this.currentMonth + 1, i);
      this.calendarDays.push({
        dayNumber: i,
        date: date,
        currentMonth: false,
        available: false
      });
    }
  }

  previousMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.updateCalendar();
    this.updateMonthName();
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.updateCalendar();
    this.updateMonthName();
  }

selectDate(date: Date) {
  const yyyy = date.getFullYear();
  const mm = (date.getMonth() + 1).toString().padStart(2, '0');
  const dd = date.getDate().toString().padStart(2, '0');
  const formattedDate = `${yyyy}-${mm}-${dd}`;

  this.selectedDate = formattedDate;

  this.http.get<any>('https://cuidarnos.up.railway.app/api/doctor-disponible', {
    params: { fecha: formattedDate }
  }).subscribe({
    next: (doctor) => {
      if (doctor) {
        // Asegúrate de que los datos vengan bien formateados
        this.filteredDoctors = [{
          id: doctor.id,
          name: doctor.nombre,
          specialty: doctor.especialidad || 'No especificada',
          specialtyId: 1, // esto es dummy ya que no estás filtrando
          nextAvailable: 'Disponible ese día'
        }];
        this.selectedDoctor = doctor.id;

        // Cargar horarios
        this.loadAvailableTimeSlots(formattedDate, doctor.id);
      } else {
        this.filteredDoctors = [];
        this.selectedDoctor = null;
        this.availableTimeSlots = [];
        alert('No hay médico disponible ese día');
      }
    },
    error: (err) => {
      console.error('❌ Error al obtener doctor del día:', err);
      this.filteredDoctors = [];
      this.selectedDoctor = null;
      this.availableTimeSlots = [];
      alert('No se pudo cargar el médico disponible');
    }
  });
}




isSelectedDate(date: Date): boolean {
  if (!this.selectedDate) return false;

  const selected = new Date(this.selectedDate);  // convertir string a Date

  return date.getFullYear() === selected.getFullYear() &&
         date.getMonth() === selected.getMonth() &&
         date.getDate() === selected.getDate();
}

  generateTimeSlots() {
    // This would typically come from an API based on doctor availability
    // For demo purposes, we'll generate some time slots
    this.availableTimeSlots = [
      '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
      '11:00 AM', '11:30 AM', '2:00 PM', '2:30 PM',
      '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'
    ];
  }

  selectTimeSlot(slot: string) {
    this.selectedTimeSlot = slot;
  }

  selectAppointmentType(typeId: number) {
    this.selectedAppointmentType = typeId;
  }

  // Step 4: Confirmation
  getSelectedDoctorName(): string {
    const doctor = this.doctors.find(d => d.id === this.selectedDoctor);
    return doctor ? doctor.name : '';
  }

  getSelectedSpecialtyName(): string {
    const specialty = this.specialties.find(s => s.id === this.selectedSpecialty);
    return specialty ? specialty.name : '';
  }

formatSelectedDate(): string {
  if (!this.selectedDate) return '';

  const selected = new Date(this.selectedDate);  // convertir string a Date

  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };

  return selected.toLocaleDateString('es-CL', options);
}
  getSelectedAppointmentTypeName(): string {
    const type = this.appointmentTypes.find(t => t.id === this.selectedAppointmentType);
    return type ? type.name : '';
  }

  getSelectedAppointmentTypeDuration(): number {
    const type = this.appointmentTypes.find(t => t.id === this.selectedAppointmentType);
    return type ? type.duration : 0;
  }

confirmAppointment() {
  const payload = {
    pacienteId: this.authService.getUsuario().id,  // Asume que estás usando localStorage
    medicoId: this.selectedDoctor,
    fecha: this.selectedDate,
    hora: this.selectedTimeSlot,
    tipo: this.getSelectedAppointmentTypeName(),
    notas: this.appointmentNotes
  };

  this.http.post('https://cuidarnos.up.railway.app/api/consultas', payload).subscribe({
    next: () => {
      alert('✅ Consulta agendada con éxito');
      this.router.navigateByUrl('/confirmacion-exitosa'); // o /home, según prefieras
    },
    error: (err) => {
      console.error('❌ Error al agendar:', err);
      alert('Ocurrió un error al agendar la consulta');
    }
  });
}


loadAvailableTimeSlots(fecha: string, medicoId: number) {
  this.http.get<string[]>('https://cuidarnos.up.railway.app/api/disponibilidad', {
    params: {
      medicoId: medicoId.toString(),
      fecha
    }
  }).subscribe({
    next: (slots) => {
      this.availableTimeSlots = slots;
    },
    error: (err) => {
      console.error('❌ Error al cargar horarios:', err);
    }
  });
}

}