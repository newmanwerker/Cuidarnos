import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
  standalone: false
})
export class SchedulePage implements OnInit {
  todayAppointments = [
    { 
      id: 1, 
      patientName: 'Sebastian Rodriguez', 
      patientId: '12345678',
      time: '9:00 AM', 
      type: 'Check-up', 
      status: 'completed',
      duration: 30
    },
    { 
      id: 2, 
      patientName: 'Ana Martinez', 
      patientId: '87654321',
      time: '9:30 AM', 
      type: 'Follow-up', 
      status: 'completed',
      duration: 15
    },
    { 
      id: 3, 
      patientName: 'Carlos Perez', 
      patientId: '11223344',
      time: '10:00 AM', 
      type: 'New Condition', 
      status: 'upcoming',
      duration: 45
    },
    { 
      id: 4, 
      patientName: 'Maria Lopez', 
      patientId: '55667788',
      time: '10:30 AM', 
      type: 'Check-up', 
      status: 'upcoming',
      duration: 30
    },
    { 
      id: 5, 
      patientName: 'Juan Silva', 
      patientId: '99887766',
      time: '11:00 AM', 
      type: 'Follow-up', 
      status: 'in-progress',
      duration: 15
    }
  ];

  constructor(
    private router: Router,
    private toastController: ToastController
  ) { }

  ngOnInit() {
  }

  getCurrentDate(): string {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return today.toLocaleDateString('en-US', options);
  }

  getScheduleStatus(): string {
    const completed = this.todayAppointments.filter(apt => apt.status === 'completed').length;
    const total = this.todayAppointments.length;
    
    if (completed === total) return 'All Complete';
    if (completed === 0) return 'Not Started';
    return 'In Progress';
  }

  getStatusColor(): string {
    const completed = this.todayAppointments.filter(apt => apt.status === 'completed').length;
    const total = this.todayAppointments.length;
    
    if (completed === total) return 'success';
    if (completed === 0) return 'medium';
    return 'warning';
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'completed': return 'checkmark-circle';
      case 'in-progress': return 'play-circle';
      case 'upcoming': return 'time';
      default: return 'time';
    }
  }

  getStatusIconColor(status: string): string {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'warning';
      case 'upcoming': return 'medium';
      default: return 'medium';
    }
  }

  async joinMeeting(appointment: any) {
    const toast = await this.toastController.create({
      message: `Joining meeting with ${appointment.patientName}...`,
      duration: 2000,
      position: 'bottom',
      color: 'success'
    });
    await toast.present();
    
    // Here you would typically integrate with a video calling service
    // For now, we'll just update the status
    appointment.status = 'in-progress';
  }

  async continueSession(appointment: any) {
    const toast = await this.toastController.create({
      message: `Continuing session with ${appointment.patientName}...`,
      duration: 2000,
      position: 'bottom',
      color: 'primary'
    });
    await toast.present();
  }

  viewNotes(appointment: any) {
    // Navigate to appointment notes or open a modal
    console.log('View notes for appointment:', appointment);
  }
}