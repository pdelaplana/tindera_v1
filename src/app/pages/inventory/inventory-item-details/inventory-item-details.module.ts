import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InventoryItemDetailsPageRoutingModule } from './inventory-item-details-routing.module';

import { InventoryItemDetailsPage } from './inventory-item-details.page';
import { SharedComponentsModule } from '@app/components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SharedComponentsModule,
    InventoryItemDetailsPageRoutingModule
  ],
  declarations: [InventoryItemDetailsPage]
})
export class InventoryItemDetailsPageModule {}
