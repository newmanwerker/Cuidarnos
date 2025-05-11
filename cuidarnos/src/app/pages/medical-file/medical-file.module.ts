import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MedicalFilePageRoutingModule } from './medical-file-routing.module';

import { MedicalFilePage } from './medical-file.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MedicalFilePageRoutingModule
  ],
  declarations: [MedicalFilePage]
})
export class MedicalFilePageModule {}
