import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RegProspIniPageRoutingModule } from './reg-prosp-ini-routing.module';
import { RegProspIniPage } from './reg-prosp-ini.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RegProspIniPageRoutingModule
  ],
  declarations: [RegProspIniPage]
})
export class RegProspIniPageModule {}
