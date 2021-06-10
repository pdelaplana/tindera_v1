import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderProductPage } from './order-product.page';

const routes: Routes = [
  {
    path: '',
    component: OrderProductPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderProductPageRoutingModule {}
