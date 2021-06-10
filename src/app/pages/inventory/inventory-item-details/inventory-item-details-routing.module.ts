import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InventoryItemDetailsPage } from './inventory-item-details.page';

const routes: Routes = [
  {
    path: '',
    component: InventoryItemDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryItemDetailsPageRoutingModule {}
