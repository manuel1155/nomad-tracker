import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegSeguimientoPage } from './reg-seguimiento.page';

const routes: Routes = [
  {
    path: '',
    component: RegSeguimientoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegSeguimientoPageRoutingModule {}
