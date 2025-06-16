import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PatientSearchPageRoutingModule } from './patient-search-routing.module';

import { PatientSearchPage } from './patient-search.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PatientSearchPageRoutingModule
  ],
  declarations: [PatientSearchPage]
})
export class PatientSearchPageModule {}
