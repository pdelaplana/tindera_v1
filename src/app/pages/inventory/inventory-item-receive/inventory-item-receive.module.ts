import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InventoryItemReceivePageRoutingModule } from './inventory-item-receive-routing.module';

import { InventoryItemReceivePage } from './inventory-item-receive.page';
import { SharedComponentsModule } from '@app/components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SharedComponentsModule,
    InventoryItemReceivePageRoutingModule
  ],
  declarations: [InventoryItemReceivePage]
})
export class InventoryItemReceivePageModule {}
