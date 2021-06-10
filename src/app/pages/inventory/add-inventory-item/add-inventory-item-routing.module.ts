import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddInventoryItemPage } from './add-inventory-item.page';

const routes: Routes = [
  {
    path: '',
    component: AddInventoryItemPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddInventoryItemPageRoutingModule {}
