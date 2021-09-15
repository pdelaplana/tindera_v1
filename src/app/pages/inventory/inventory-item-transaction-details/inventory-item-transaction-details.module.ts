import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InventoryItemTransactionDetailsPageRoutingModule } from './inventory-item-transaction-details-routing.module';

import { InventoryItemTransactionDetailsPage } from './inventory-item-transaction-details.page';
import { SharedComponentsModule } from '@app/components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedComponentsModule,
    InventoryItemTransactionDetailsPageRoutingModule
  ],
  declarations: [InventoryItemTransactionDetailsPage]
})
export class InventoryItemTransactionDetailsPageModule {}
