import { NgModule, LOCALE_ID  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CalendarioColadosPageRoutingModule } from './calendario-colados-routing.module';

import { CalendarioColadosPage } from './calendario-colados.page';

import { NgCalendarModule  } from 'ionic2-calendar';
 
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
registerLocaleData(localeDe);

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalendarioColadosPageRoutingModule,
    NgCalendarModule
  ],
  declarations: [CalendarioColadosPage],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-MX' }
  ]
})
export class CalendarioColadosPageModule {}
