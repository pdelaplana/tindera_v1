import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@app/guards/auth.guard';

import { OrderPage } from './order.page';

const routes: Routes = [
  {
    path: '',
    component: OrderPage
  },
  {
    path: 'item',
    loadChildren: () => import('./order-product/order-product.module').then( m => m.OrderProductPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'cart',
    loadChildren: () => import('./cart/cart.module').then( m => m.CartPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'checkout',
    loadChildren: () => import('./checkout/checkout.module').then( m => m.CheckoutPageModule),
    canActivate:[AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderPageRoutingModule {}
