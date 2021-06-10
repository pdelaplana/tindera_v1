import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StoreSetupPage } from './store-setup.page';

const routes: Routes = [
  {
    path: '',
    component: StoreSetupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StoreSetupPageRoutingModule {}
