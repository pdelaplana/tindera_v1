import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InventoryCountItemAdjustmentPage } from './inventory-count-item-adjustment.page';

const routes: Routes = [
  {
    path: '',
    component: InventoryCountItemAdjustmentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryCountItemAdjustmentPageRoutingModule {}
