import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ObrasPage } from './obras.page';

const routes: Routes = [
  {
    path: '',
    component: ObrasPage
  },
  {
    path: 'mod-sel-cli',
    loadChildren: () => import('./mod-sel-cli/mod-sel-cli.module').then( m => m.ModSelCliPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ObrasPageRoutingModule {}
