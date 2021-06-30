import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MapsTempPageRoutingModule } from './maps-temp-routing.module';

import { MapsTempPage } from './maps-temp.page';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MapsTempPageRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDtomsm7eXWYIgxXUVzzuURGRJYWxwTbb8', 
      libraries: ['places']
    })
  ],
  declarations: [MapsTempPage]
})
export class MapsTempPageModule {}
