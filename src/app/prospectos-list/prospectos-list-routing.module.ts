import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProspectosListPage } from './prospectos-list.page';

const routes: Routes = [
  {
    path: '',
    component: ProspectosListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProspectosListPageRoutingModule {}
