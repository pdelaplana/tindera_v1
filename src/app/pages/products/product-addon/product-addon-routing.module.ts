import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductAddonPage } from './product-addon.page';

const routes: Routes = [
  {
    path: '',
    component: ProductAddonPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductAddonPageRoutingModule {}
