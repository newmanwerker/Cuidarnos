import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  { path: '', redirectTo: 'welcome', pathMatch: 'full'},
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)},
  { path: 'welcome', loadChildren: () => import('./pages/welcome/welcome.module').then( m => m.WelcomePageModule)},
  { path: 'medical-file', loadChildren: () => import('./pages/medical-file/medical-file.module').then( m => m.MedicalFilePageModule)},
  { path: 'booking', loadChildren: () => import('./pages/booking/booking.module').then( m => m.BookingPageModule)},
  { path: 'settings', loadChildren: () => import('./pages/settings/settings.module').then( m => m.SettingsPageModule)},
  { path: 'accessibility', loadChildren: () => import('./pages/accessibility/accessibility.module').then( m => m.AccessibilityPageModule)},
  { path: 'video-call', loadChildren: () => import('./pages/video-call/video-call.module').then( m => m.VideoCallPageModule)},  {
    path: 'doctor-home',
    loadChildren: () => import('./pages/doctor-home/doctor-home.module').then( m => m.DoctorHomePageModule)
  },
  {
    path: 'schedule',
    loadChildren: () => import('./pages/schedule/schedule.module').then( m => m.SchedulePageModule)
  },
  {
    path: 'patient-search',
    loadChildren: () => import('./pages/patient-search/patient-search.module').then( m => m.PatientSearchPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }