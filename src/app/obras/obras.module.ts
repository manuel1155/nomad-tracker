import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ObrasPageRoutingModule } from './obras-routing.module';
import { ObrasPage } from './obras.page';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ObrasTabComponent } from './../componentes/obras-tab/obras-tab.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ObrasPageRoutingModule,
    NgxDatatableModule
  ],
  declarations: [ObrasPage, ObrasTabComponent]
})
export class ObrasPageModule { }
