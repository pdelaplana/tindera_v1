import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LowInventoryAlertsPage } from './low-inventory-alerts.page';

const routes: Routes = [
  {
    path: '',
    component: LowInventoryAlertsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LowInventoryAlertsPageRoutingModule {}
