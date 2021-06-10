import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InventoryBalancePage } from './inventory-balance.page';

const routes: Routes = [
  {
    path: '',
    component: InventoryBalancePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryBalancePageRoutingModule {}
