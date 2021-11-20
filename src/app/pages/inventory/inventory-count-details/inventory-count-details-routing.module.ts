import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InventoryCountDetailsPage } from './inventory-count-details.page';

const routes: Routes = [
  {
    path: '',
    component: InventoryCountDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryCountDetailsPageRoutingModule {}
