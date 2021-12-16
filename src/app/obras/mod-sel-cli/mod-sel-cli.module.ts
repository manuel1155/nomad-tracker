import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModSelCliPageRoutingModule } from './mod-sel-cli-routing.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ModSelCliPage } from './mod-sel-cli.page';
import { ClientesTabComponent } from './../../componentes/clientes-tab/clientes-tab.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxDatatableModule,
    ModSelCliPageRoutingModule
  ],
  declarations: [ModSelCliPage,ClientesTabComponent]
})
export class ModSelCliPageModule {}
