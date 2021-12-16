import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditHoraPage } from './edit-hora.page';

const routes: Routes = [
  {
    path: '',
    component: EditHoraPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditHoraPageRoutingModule {}
