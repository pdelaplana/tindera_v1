import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductBOMPage } from './product-bom.page';

const routes: Routes = [
  {
    path: '',
    component: ProductBOMPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductBOMPageRoutingModule {}
