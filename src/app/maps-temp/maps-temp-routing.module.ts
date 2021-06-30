import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapsTempPage } from './maps-temp.page';

const routes: Routes = [
  {
    path: '',
    component: MapsTempPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapsTempPageRoutingModule {}
