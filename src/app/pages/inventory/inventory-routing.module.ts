import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InventoryPage } from './inventory.page';

const routes: Routes = [
  {
    path: '',
    component: InventoryPage,
    children:[
      {
        path: 'add',
        loadChildren: () => import('./add-inventory-item/add-inventory-item.module').then( m => m.AddInventoryItemPageModule)
      },
      {
        path: 'balance',
        loadChildren: () => import('./inventory-balance/inventory-balance.module').then( m => m.InventoryBalancePageModule)
      }
    ]
  },
  {
    path: 'details',
    loadChildren: () => import('./inventory-item-details/inventory-item-details.module').then( m => m.InventoryItemDetailsPageModule)
  },
  {
    path: 'receive',
    loadChildren: () => import('./inventory-item-receive/inventory-item-receive.module').then( m => m.InventoryItemReceivePageModule)
  },
  {
    path: 'transactions',
    loadChildren: () => import('./inventory-item-transactions/inventory-item-transactions.module').then( m => m.InventoryItemTransactionsPageModule)
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryPageRoutingModule {}
