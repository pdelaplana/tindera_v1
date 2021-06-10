import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InventoryItemHistoryPage } from './inventory-item-history.page';

const routes: Routes = [
  {
    path: '',
    component: InventoryItemHistoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryItemHistoryPageRoutingModule {}
