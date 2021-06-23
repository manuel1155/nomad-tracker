import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ObrasPage } from './obras.page';

const routes: Routes = [
  {
    path: '',
    component: ObrasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ObrasPageRoutingModule {}
