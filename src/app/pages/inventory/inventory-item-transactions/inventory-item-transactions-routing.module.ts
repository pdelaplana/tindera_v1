import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InventoryItemTransactionsPage } from './inventory-item-transactions.page';

const routes: Routes = [
  {
    path: '',
    component: InventoryItemTransactionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryItemTransactionsPageRoutingModule {}
