import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewPatientFilePageRoutingModule } from './view-patient-file-routing.module';

import { ViewPatientFilePage } from './view-patient-file.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewPatientFilePageRoutingModule
  ],
  declarations: [ViewPatientFilePage]
})
export class ViewPatientFilePageModule {}
