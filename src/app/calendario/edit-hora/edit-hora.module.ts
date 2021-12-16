import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditHoraPageRoutingModule } from './edit-hora-routing.module';

import { EditHoraPage } from './edit-hora.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditHoraPageRoutingModule
  ],
  declarations: [EditHoraPage]
})
export class EditHoraPageModule {}
