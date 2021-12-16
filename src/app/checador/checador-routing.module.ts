import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChecadorPage } from './checador.page';

const routes: Routes = [
  {
    path: '',
    component: ChecadorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChecadorPageRoutingModule {}
