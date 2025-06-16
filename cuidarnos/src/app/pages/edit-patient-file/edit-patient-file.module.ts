import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditPatientFilePageRoutingModule } from './edit-patient-file-routing.module';

import { EditPatientFilePage } from './edit-patient-file.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditPatientFilePageRoutingModule
  ],
  declarations: [EditPatientFilePage]
})
export class EditPatientFilePageModule {}
