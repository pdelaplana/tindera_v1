import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InventoryItemTransactionDetailsPage } from './inventory-item-transaction-details.page';

const routes: Routes = [
  {
    path: '',
    component: InventoryItemTransactionDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryItemTransactionDetailsPageRoutingModule {}
