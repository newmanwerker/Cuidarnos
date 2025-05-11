import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MedicalFilePage } from './medical-file.page';

const routes: Routes = [
  {
    path: '',
    component: MedicalFilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MedicalFilePageRoutingModule {}
