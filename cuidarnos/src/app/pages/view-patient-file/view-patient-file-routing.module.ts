import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewPatientFilePage } from './view-patient-file.page';

const routes: Routes = [
  {
    path: '',
    component: ViewPatientFilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewPatientFilePageRoutingModule {}
