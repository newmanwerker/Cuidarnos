import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DoctorHomePageRoutingModule } from './doctor-home-routing.module';

import { DoctorHomePage } from './doctor-home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DoctorHomePageRoutingModule
  ],
  declarations: [DoctorHomePage]
})
export class DoctorHomePageModule {}
