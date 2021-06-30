import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CheckPermisosPage } from './check-permisos.page';

const routes: Routes = [
  {
    path: '',
    component: CheckPermisosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CheckPermisosPageRoutingModule {}
