import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'start',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./pages/folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'sales',
    loadChildren: () => import('./pages/sales/sales.module').then( m => m.SalesPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'order',
    loadChildren: () => import('./pages/order/order.module').then( m => m.OrderPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'order/item',
    loadChildren: () => import('./pages/order-product/order-product.module').then( m => m.OrderProductPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'order/cart',
    loadChildren: () => import('./pages/cart/cart.module').then( m => m.CartPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'products',
    loadChildren: () => import('./pages/products/products.module').then( m => m.ProductsPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'inventory',
    loadChildren: () => import('./pages/inventory/inventory.module').then( m => m.InventoryPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'start',
    loadChildren: () => import('./pages/start/start.module').then( m => m.StartPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'logout',
    loadChildren: () => import('./pages/logout/logout.module').then( m => m.LogoutPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then( m => m.SignupPageModule)
  },
  {
    path: 'setup/store',
    loadChildren: () => import('./pages/store-setup/store-setup.module').then( m => m.StoreSetupPageModule),
    canActivate:[AuthGuard]
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
