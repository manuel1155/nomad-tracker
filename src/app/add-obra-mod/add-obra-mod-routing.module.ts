import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddObraModPage } from './add-obra-mod.page';

const routes: Routes = [
  {
    path: '',
    component: AddObraModPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddObraModPageRoutingModule {}
