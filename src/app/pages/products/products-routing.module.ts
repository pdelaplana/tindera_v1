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
  {
    path: 'addon',
    loadChildren: () => import('./product-addon/product-addon.module').then( m => m.ProductAddonPageModule)
  },

  /*
  {
    path: 'addon',
    loadChildren: () => import('./product-add-on/product-add-on.module').then( m => m.ProductAddOnPageModule)
  },
  */
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsPageRoutingModule {}
