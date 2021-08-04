import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InventoryCountListDetailsPage } from './inventory-count-list-details.page';

const routes: Routes = [
  {
    path: '',
    component: InventoryCountListDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryCountListDetailsPageRoutingModule {}
