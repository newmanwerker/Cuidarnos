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
  isSubmitting = false;

  constructor(
    private router: Router,
    private toastController: ToastController,
    private http: HttpClient,
    private authService: AuthService
  ) { }

ngOnInit() {
  this.selectedSpecialty = this.specialties[0].id;
  this.doctors = [];
  this.filteredDoctors = [];
  this.selectedDoctor = null;

  // Obtener fechas disponibles y luego actualizar calendario
  this.http.get<string[]>('https://cuidarnos.up.railway.app/api/dias-disponibles').subscribe({
    next: (fechas) => {
      this.availableDates = fechas;
      console.log('✅ Fechas con disponibilidad:', this.availableDates);

      this.updateCalendar();
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

    // Saltar el paso 2 (Doctor) si ya no se usa
    if (this.currentStep === 2) {
      this.currentStep = 3;
    }
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
        return true;
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

  const firstDay = new Date(this.currentYear, this.currentMonth, 1);
  const startingDay = firstDay.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado

  const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
  const totalDays = lastDay.getDate();

  const prevMonthLastDay = new Date(this.currentYear, this.currentMonth, 0).getDate();

  // 🔹 Rellenar días del mes anterior (inicio)
  for (let i = 0; i < startingDay; i++) {
    const day = prevMonthLastDay - startingDay + 1 + i;
    const date = new Date(this.currentYear, this.currentMonth - 1, day);
    this.calendarDays.push({
      dayNumber: day,
      date,
      currentMonth: false,
      available: false
    });
  }

  // 🔹 Días del mes actual
  for (let i = 1; i <= totalDays; i++) {
    const date = new Date(this.currentYear, this.currentMonth, i);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isPast = date < today;

    const formatted = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    const available = !isPast && this.availableDates.includes(formatted);

    this.calendarDays.push({
      dayNumber: i,
      date,
      currentMonth: true,
      available
    });
  }

  // 🔹 Rellenar días del mes siguiente (final)
  const totalCells = Math.ceil(this.calendarDays.length / 7) * 7;
  const nextMonthDays = totalCells - this.calendarDays.length;

  for (let i = 1; i <= nextMonthDays; i++) {
    const date = new Date(this.currentYear, this.currentMonth + 1, i);
    this.calendarDays.push({
      dayNumber: i,
      date,
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

  // Normalizamos ambos a solo YYYY-MM-DD para evitar errores de hora
  const format = (d: Date) =>
    `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;

  const selectedStr = this.selectedDate;
  const currentStr = format(date);

  return selectedStr === currentStr;
}


selectTimeSlot(slot: string) {
  // Asegúrate que sea HH:MM sin segundos
  this.selectedTimeSlot = slot.slice(0, 5);
}

  selectAppointmentType(typeId: number) {
    this.selectedAppointmentType = typeId;
  }

  // Step 4: Confirmation
getSelectedDoctorName(): string {
  const doctor = this.filteredDoctors.find(d => d.id === this.selectedDoctor);
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
  if (this.isSubmitting) return;
  

  this.isSubmitting = true;

  const payload = {
    pacienteId: this.authService.getUsuario().id,
    medicoId: this.selectedDoctor,
    fecha: this.selectedDate,
    hora: this.selectedTimeSlot,
    tipo: this.getSelectedAppointmentTypeName(),
    notas: this.appointmentNotes
  };

  this.http.post('https://cuidarnos.up.railway.app/api/consultas', payload).subscribe({
    next: () => {

      this.loadAvailableTimeSlots(this.selectedDate!, this.selectedDoctor!);
      // 🔄 Después de agendar, recargar la data del paciente desde loginPersona
      const rut = this.authService.getUsuario().rut;
      const nombre = this.authService.getUsuario().nombre;

      this.http.post('https://cuidarnos.up.railway.app/api/loginPersona', { rut, nombre }).subscribe({
        next: (updatedData: any) => {
          localStorage.setItem('userData', JSON.stringify(updatedData));
          this.router.navigateByUrl('/home');
        },
        error: () => {
          alert('Consulta agendada, pero no se pudo actualizar la sesión. Recarga manualmente.');
          this.router.navigateByUrl('/home');
        }
      });
    },
    error: (err) => {
      if (err.status === 409) {
        alert('⚠️ Ya tienes una consulta pendiente. Solo puedes agendar una a la vez.');
      } else {
        alert('Ocurrió un error al agendar la consulta. Intenta más tarde.');
      }
      this.router.navigateByUrl('/home');
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