import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditPatientFilePage } from './edit-patient-file.page';

const routes: Routes = [
  {
    path: '',
    component: EditPatientFilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditPatientFilePageRoutingModule {}
