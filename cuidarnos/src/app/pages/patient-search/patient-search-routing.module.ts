import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PatientSearchPage } from './patient-search.page';

const routes: Routes = [
  {
    path: '',
    component: PatientSearchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PatientSearchPageRoutingModule {}
