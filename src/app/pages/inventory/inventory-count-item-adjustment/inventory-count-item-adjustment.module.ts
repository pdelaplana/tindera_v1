import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InventoryCountItemAdjustmentPageRoutingModule } from './inventory-count-item-adjustment-routing.module';

import { InventoryCountItemAdjustmentPage } from './inventory-count-item-adjustment.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    InventoryCountItemAdjustmentPageRoutingModule
  ],
  declarations: [InventoryCountItemAdjustmentPage]
})
export class InventoryCountItemAdjustmentPageModule {}
