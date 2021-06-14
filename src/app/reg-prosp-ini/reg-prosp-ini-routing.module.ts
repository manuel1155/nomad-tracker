import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegProspIniPage } from './reg-prosp-ini.page';

const routes: Routes = [
  {
    path: '',
    component: RegProspIniPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegProspIniPageRoutingModule {}
