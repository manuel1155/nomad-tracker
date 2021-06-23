import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddObraPage } from './add-obra.page';

const routes: Routes = [
  {
    path: '',
    component: AddObraPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddObraPageRoutingModule {}
