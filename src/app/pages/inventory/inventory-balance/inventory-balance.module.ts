import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InventoryBalancePageRoutingModule } from './inventory-balance-routing.module';

import { InventoryBalancePage } from './inventory-balance.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InventoryBalancePageRoutingModule
  ],
  declarations: [InventoryBalancePage]
})
export class InventoryBalancePageModule {}
