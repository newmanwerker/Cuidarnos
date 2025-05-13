import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

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
  doctors = [
    { 
      id: 1, 
      name: 'Maria Garcia', 
      specialty: 'General Medicine',
      specialtyId: 1,
      rating: 4.8,
      reviewCount: 124,
      nextAvailable: 'Hoy'
    },
    { 
      id: 2, 
      name: 'Carlos Rodriguez', 
      specialty: 'Cardiology',
      specialtyId: 2,
      rating: 4.9,
      reviewCount: 87,
      nextAvailable: 'Mañana'
    },
    { 
      id: 3, 
      name: 'Ana Martinez', 
      specialty: 'Gastroenterology',
      specialtyId: 4,
      rating: 4.7,
      reviewCount: 56,
      nextAvailable: 'Hoy'
    },
    { 
      id: 4, 
      name: 'Juan Perez', 
      specialty: 'General Medicine',
      specialtyId: 1,
      rating: 4.5,
      reviewCount: 92,
      nextAvailable: 'Mayo 15'
    }
  ];
  filteredDoctors: any[] = [];
  selectedDoctor: number | null = null;
  
  // Step 3: Date and Time
  currentDate = new Date();
  currentYear = this.currentDate.getFullYear();
  currentMonth = this.currentDate.getMonth();
  currentMonthName = '';
  weekdays = ['Dom', 'Lun', 'Mar', 'Mier', 'Jue', 'Vie', 'Sab'];
  calendarDays: any[] = [];
  selectedDate: Date | null = null;
  
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
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.updateCalendar();
    this.updateMonthName();
  }

  // Step Navigation
  nextStep() {
    if (this.canProceed()) {
      this.currentStep++;
      
      if (this.currentStep === 2) {
        this.filterDoctorsBySpecialty();
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
    this.selectedDate = date;
    this.generateTimeSlots();
    this.selectedTimeSlot = null;
  }

  isSelectedDate(date: Date): boolean {
    if (!this.selectedDate) return false;
    
    return date.getFullYear() === this.selectedDate.getFullYear() &&
           date.getMonth() === this.selectedDate.getMonth() &&
           date.getDate() === this.selectedDate.getDate();
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
    
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    
    return this.selectedDate.toLocaleDateString('en-US', options);
  }

  getSelectedAppointmentTypeName(): string {
    const type = this.appointmentTypes.find(t => t.id === this.selectedAppointmentType);
    return type ? type.name : '';
  }

  getSelectedAppointmentTypeDuration(): number {
    const type = this.appointmentTypes.find(t => t.id === this.selectedAppointmentType);
    return type ? type.duration : 0;
  }

  async confirmAppointment() {
    // Here you would typically send the appointment data to your backend
    
    // Show confirmation toast
    const toast = await this.toastController.create({
      message: 'Reunión Agendad Correctamente!',
      duration: 2000,
      position: 'bottom',
      color: 'success'
    });
    await toast.present();
    
    // Navigate back to home
    this.router.navigate(['/home']);
  }
}