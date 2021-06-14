import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProspectosListPageRoutingModule } from './prospectos-list-routing.module';
import { ProspectosListPage } from './prospectos-list.page';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxDatatableModule,
    ProspectosListPageRoutingModule
  ],
  declarations: [ProspectosListPage]
})
export class ProspectosListPageModule {}
