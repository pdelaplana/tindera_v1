import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InventoryItemAdjustmentPageRoutingModule } from './inventory-item-adjustment-routing.module';

import { InventoryItemAdjustmentPage } from './inventory-item-adjustment.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    InventoryItemAdjustmentPageRoutingModule
  ],
  declarations: [InventoryItemAdjustmentPage]
})
export class InventoryItemAdjustmentPageModule {}
