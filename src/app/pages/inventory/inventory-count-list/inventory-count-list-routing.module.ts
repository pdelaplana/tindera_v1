import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InventoryCountListPage } from './inventory-count-list.page';

const routes: Routes = [
  {
    path: '',
    component: InventoryCountListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryCountListPageRoutingModule {}
