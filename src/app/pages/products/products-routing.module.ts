import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductsPage } from './products.page';

const routes: Routes = [
  {
    path: '',
    component: ProductsPage,
    children:
    [
      {
        path: 'list',
        loadChildren: () => import('./product-list/product-list.module').then( m => m.ProductListPageModule)
      }
    ]
  },
  {
    path: 'add',
    loadChildren: () => import('./product-add/product-add.module').then( m => m.ProductAddPageModule)
  },
  {
    path: 'details',
    loadChildren: () => import('./product-details/product-details.module').then( m => m.ProductDetailsPageModule)
  },
  {
    path: 'bom',
    loadChildren: () => import('./product-bom/product-bom.module').then( m => m.ProductBOMPageModule)
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsPageRoutingModule {}
