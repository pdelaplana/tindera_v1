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
      },
      {
        path: 'counts',
        loadChildren: () => import('./inventory-count-list/inventory-count-list.module').then( m => m.InventoryCountListPageModule)
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
  },
  {
    path: 'count',
    loadChildren: () => import('./inventory-count/inventory-count.module').then( m => m.InventoryCountPageModule)
  },
  {
    path: 'adjust',
    loadChildren: () => import('./inventory-item-adjustment/inventory-item-adjustment.module').then( m => m.InventoryItemAdjustmentPageModule)
  },
  {
    path: 'transaction/details',
    loadChildren: () => import('./inventory-item-transaction-details/inventory-item-transaction-details.module').then( m => m.InventoryItemTransactionDetailsPageModule)
  },
  {
    path: 'inventory-count-start-dialog',
    loadChildren: () => import('./inventory-count-start-dialog/inventory-count-start-dialog.module').then( m => m.InventoryCountStartDialogPageModule)
  },
  {
    path: 'count/items',
    loadChildren: () => import('./inventory-count-items/inventory-count-items.module').then( m => m.InventoryCountItemsPageModule)
  },
  {
    path: 'count/details',
    loadChildren: () => import('./inventory-count-details/inventory-count-details.module').then( m => m.InventoryCountDetailsPageModule)
  },
  {
    path: 'count/adjustment',
    loadChildren: () => import('./inventory-count-item-adjustment/inventory-count-item-adjustment.module').then( m => m.InventoryCountItemAdjustmentPageModule)
  },




 
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryPageRoutingModule {}
