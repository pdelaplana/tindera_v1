import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InventoryCountItemsPageRoutingModule } from './inventory-count-items-routing.module';

import { InventoryCountItemsPage } from './inventory-count-items.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    InventoryCountItemsPageRoutingModule
  ],
  declarations: [InventoryCountItemsPage]
})
export class InventoryCountItemsPageModule {}
