import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InventoryCountListDetailsPageRoutingModule } from './inventory-count-list-details-routing.module';

import { InventoryCountListDetailsPage } from './inventory-count-list-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    InventoryCountListDetailsPageRoutingModule
  ],
  declarations: [InventoryCountListDetailsPage]
})
export class InventoryCountListDetailsPageModule {}
