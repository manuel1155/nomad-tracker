import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddVisitaPage } from './add-visita.page';

const routes: Routes = [
  {
    path: '',
    component: AddVisitaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddVisitaPageRoutingModule {}
