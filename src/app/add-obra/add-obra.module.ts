import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { AddObraPageRoutingModule } from './add-obra-routing.module';

import { AddObraPage } from './add-obra.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AddObraPageRoutingModule
  ],
  declarations: [AddObraPage]
})
export class AddObraPageModule {}
