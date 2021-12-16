import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CalModalPageRoutingModule } from './cal-modal-routing.module';

import { CalModalPage } from './cal-modal.page';

import { NgCalendarModule } from 'ionic2-calendar';
import { ClientesTabComponent } from 'src/app/componentes/clientes-tab/clientes-tab.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CalModalPageRoutingModule,
    NgCalendarModule
  ],
  declarations: [CalModalPage, ClientesTabComponent]
})
export class CalModalPageModule { }
