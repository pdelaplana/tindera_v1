import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InventoryCountDetailsPageRoutingModule } from './inventory-count-details-routing.module';

import { InventoryCountDetailsPage } from './inventory-count-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InventoryCountDetailsPageRoutingModule
  ],
  declarations: [InventoryCountDetailsPage]
})
export class InventoryCountDetailsPageModule {}
