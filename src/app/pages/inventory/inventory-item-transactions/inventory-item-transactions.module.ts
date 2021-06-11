import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InventoryItemTransactionsPageRoutingModule } from './inventory-item-transactions-routing.module';

import { InventoryItemTransactionsPage } from './inventory-item-transactions.page';
import { SharedComponentsModule } from '@app/components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedComponentsModule,
    InventoryItemTransactionsPageRoutingModule
  ],
  declarations: [InventoryItemTransactionsPage]
})
export class InventoryItemTransactionsPageModule {}
