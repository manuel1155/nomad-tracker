import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AddVisitaPageRoutingModule } from './add-visita-routing.module';
import { AddVisitaPage } from './add-visita.page';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ClientesTabComponent } from './../componentes/clientes-tab/clientes-tab.component';
import { ObrasTabComponent } from './../componentes/obras-tab/obras-tab.component';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    NgxDatatableModule,
    AddVisitaPageRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDtomsm7eXWYIgxXUVzzuURGRJYWxwTbb8', 
      libraries: ['places']
    })
  ],
  declarations: [AddVisitaPage,ClientesTabComponent,ObrasTabComponent]
})
export class AddVisitaPageModule {}
