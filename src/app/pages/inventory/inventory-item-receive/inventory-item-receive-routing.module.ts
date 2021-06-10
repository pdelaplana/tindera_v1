import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InventoryItemReceivePage } from './inventory-item-receive.page';

const routes: Routes = [
  {
    path: '',
    component: InventoryItemReceivePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryItemReceivePageRoutingModule {}
