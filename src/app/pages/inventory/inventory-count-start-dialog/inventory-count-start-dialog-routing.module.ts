import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InventoryCountStartDialogPage } from './inventory-count-start-dialog.page';

const routes: Routes = [
  {
    path: '',
    component: InventoryCountStartDialogPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryCountStartDialogPageRoutingModule {}
