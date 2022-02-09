import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SeguimientosListPageRoutingModule } from './seguimientos-list-routing.module';

import { SeguimientosListPage } from './seguimientos-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SeguimientosListPageRoutingModule
  ],
  declarations: [SeguimientosListPage]
})
export class SeguimientosListPageModule {}
