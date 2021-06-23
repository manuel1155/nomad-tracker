import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ClientesPageRoutingModule } from './clientes-routing.module';
import { ClientesPage } from './clientes.page';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ClientesTabComponent } from './../componentes/clientes-tab/clientes-tab.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxDatatableModule,
    ClientesPageRoutingModule
  ],
  declarations: [ClientesPage, ClientesTabComponent]
})
export class ClientesPageModule { }
