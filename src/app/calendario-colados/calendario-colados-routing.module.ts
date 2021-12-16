import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CalendarioColadosPage } from './calendario-colados.page';

const routes: Routes = [
  {
    path: '',
    component: CalendarioColadosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CalendarioColadosPageRoutingModule {}
