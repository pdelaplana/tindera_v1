import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InventoryCountPage } from './inventory-count.page';

const routes: Routes = [
  {
    path: '',
    component: InventoryCountPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryCountPageRoutingModule {}
