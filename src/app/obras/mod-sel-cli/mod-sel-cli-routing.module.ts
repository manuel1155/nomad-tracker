import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModSelCliPage } from './mod-sel-cli.page';

const routes: Routes = [
  {
    path: '',
    component: ModSelCliPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModSelCliPageRoutingModule {}
