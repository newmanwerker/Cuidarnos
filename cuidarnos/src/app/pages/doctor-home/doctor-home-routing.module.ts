import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DoctorHomePage } from './doctor-home.page';

const routes: Routes = [
  {
    path: '',
    component: DoctorHomePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DoctorHomePageRoutingModule {}
