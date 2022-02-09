import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegSeguimientoPageRoutingModule } from './reg-seguimiento-routing.module';

import { RegSeguimientoPage } from './reg-seguimiento.page';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegSeguimientoPageRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDtomsm7eXWYIgxXUVzzuURGRJYWxwTbb8', 
      libraries: ['places']
    })
  ],
  declarations: [RegSeguimientoPage]
})
export class RegSeguimientoPageModule {}
