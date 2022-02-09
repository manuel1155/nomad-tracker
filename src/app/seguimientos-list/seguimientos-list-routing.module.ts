import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SeguimientosListPage } from './seguimientos-list.page';

const routes: Routes = [
  {
    path: '',
    component: SeguimientosListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SeguimientosListPageRoutingModule {}
