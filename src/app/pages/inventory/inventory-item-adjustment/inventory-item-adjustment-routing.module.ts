import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InventoryItemAdjustmentPage } from './inventory-item-adjustment.page';

const routes: Routes = [
  {
    path: '',
    component: InventoryItemAdjustmentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryItemAdjustmentPageRoutingModule {}
