import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CheckPermisosPageRoutingModule } from './check-permisos-routing.module';

import { CheckPermisosPage } from './check-permisos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CheckPermisosPageRoutingModule
  ],
  declarations: [CheckPermisosPage]
})
export class CheckPermisosPageModule {}
