import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddObraModPageRoutingModule } from './add-obra-mod-routing.module';

import { AddObraModPage } from './add-obra-mod.page';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AddObraModPageRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDtomsm7eXWYIgxXUVzzuURGRJYWxwTbb8', 
      libraries: ['places']
    })
  ],
  declarations: [AddObraModPage]
})
export class AddObraModPageModule {}
