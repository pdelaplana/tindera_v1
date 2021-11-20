import { InventoryCount } from '@app/models/inventory-count';
import { InventoryItem } from '@app/models/inventory-item';
import { InventoryTransaction } from '@app/models/inventory-transaction';
import { Update } from '@ngrx/entity';
import { createAction, props } from '@ngrx/store';

export const inventoryActions = {
  loadInventory: createAction(
    '[Inventory] Load inventory',
    props<{ shopid: string }>()
  ),
  loadInventorySuccess: createAction(
    '[Inventory] Load inventory success',
    props<{ items: InventoryItem[] }>()
  ),
  loadInventoryFail: createAction(
    '[Inventory] Load inventory fail',
    props<{ error: any }>()
  ),
  createItem: createAction(
    '[Inventory] Create inventory item',
    props<{ item: InventoryItem }>()
  ),
  createItemSuccess: createAction(
    '[Inventory] Create inventory item success',
    props<{ item: InventoryItem }>()
  ),
  createItemFail: createAction(
    '[Inventory] Create inventory item fail',
    props<{ error: any }>()
  ),
  updateItem: createAction(
    '[Inventory] Update inventory item',
    props<{ item:InventoryItem }>()
  ),
  updateItemSuccess: createAction(
    '[Inventory] Update inventory item success',
    props<{ update: Update<InventoryItem> }>()
  ),
  updateItemFail: createAction(
    '[Inventory] Update inventory item fail',
    props<{ error: any }>()
  ),
  loadTransactions: createAction(
    '[Inventory] Load transactions',
    props<{ fromDate: Date, toDate: Date}>()
  ),
  loadTransactionsSuccess: createAction(
    '[Inventory] Load transactions success',
    props<{ transactions: InventoryTransaction[] }>()
  ),
  loadTransactionsFail: createAction(
    '[Inventory] Load transactions fail',
    props<{ error: any }>()
  ),
  loadItemTransactions: createAction(
    '[Inventory] Load transactions of item',
    props<{ itemdId: string}>()
  ),
  loadItemTransactionsSuccess: createAction(
    '[Inventory] Load transactions of item succes',
    props<{ transactions: InventoryTransaction[] }>()
  ),
  loadItemTransactionsFail: createAction(
    '[Inventory] Load transactions of item fail',
    props<{ error: any }>()
  ),
  receiveItem: createAction(
    '[Inventory] Receive item',
    props<{ 
      itemId: string, 
      itemName: string, 
      receivedOn: Date, 
      qtyReceived: number, 
      notes: string, 
      reference: string,
      unitCost: number,
      supplier: string 
    }>()
  ),
  receiveItemSuccess: createAction(
    '[Inventory] Receive item success',
    props<{ transaction: InventoryTransaction }>()
  ),
  receiveItemFail: createAction(
    '[Inventory] Receive item fail',
    props<{ error: any }>()
  ), 
  updateInventoryBalance: createAction(
    '[Inventory] Update inventory balance',
    props<{ transaction: InventoryTransaction }>()
  ),
  updateInventoryBalanceSuccess: createAction(
    '[Inventory] Update inventory balance success',
    props<{ transaction: InventoryTransaction }>()
  ),
  updateInventoryBalanceFail: createAction(
    '[Inventory] Update inventory balance fail',
    props<{ error: any }>()
  ), 
  loadCounts: createAction(
    '[Inventory] Load inventory counts',
    props<{ shopid: string }>()
  ),
  loadCountsSuccess: createAction(
    '[Inventory] Load inventory counts success',
    props<{ counts: InventoryCount[] }>()
  ),
  loadCountsFail: createAction(
    '[Inventory] Load inventory counts fail',
    props<{ error: any }>()
  ),
  submitCount: createAction(
    '[Inventory] Submit count',
    props<{ id: string }>()
  ),
  submitCountSuccess: createAction(
    '[Inventory] Submit count success',
    props<{ update: Update<InventoryCount> }>()
  ),
  submitCountFail: createAction(
    '[Inventory] Submit count success',
    props<{ error: any }>()
  ),
  archiveCount: createAction(
    '[Inventory] Archive count',
    props<{ id: string }>()
  ),
  archiveCountSuccess: createAction(
    '[Inventory] Archive count success',
    props<{ update: Update<InventoryCount> }>()
  ),
  archiveCountFail: createAction(
    '[Inventory] Archive count success',
    props<{ error: any }>()
  ),
  deleteCount: createAction(
    '[Inventory] Delete count',
    props<{ id: string}>()
  ),
  deleteCountSuccess: createAction(
    '[Inventory] Delete count success'
  ),
  deleteCountFail: createAction(
    '[Inventory] Delete count fail',
    props<{ error: any }>()
  ),
  startInventoryCount: createAction(
    '[Inventory] Start inventory count',
    props<{ count: InventoryCount }>()
  ),
  startInventoryCountSuccess: createAction(
    '[Inventory] Start inventory count success',
    props<{ count: InventoryCount }>()
  ),
  startInventoryCountFail: createAction(
    '[Inventory] Start inventory count fail',
    props<{ error: any }>()
  ),
  updateInventoryCount: createAction(
    '[Inventory] Update inventory count',
    props<{ count: InventoryCount }>()
  ),
  updateInventoryCountSuccess: createAction(
    '[Inventory] Update inventory count success',
    props<{ update: Update<InventoryCount> }>()
  ),
  updateInventoryCountFail: createAction(
    '[Inventory] Update inventory count fail',
    props<{ error:any }>()
  ),
  closeCountItem: createAction(
    '[Inventory] Close count item',
    props<{ countId: string; itemId: string }>()
  ),
  closeCountItemSuccess: createAction(
    '[Inventory] Close count item success',
    props<{ update: Update<InventoryCount> }>()
  ),
  closeCountItemFail: createAction(
    '[Inventory] Close count item fail',
    props<{ error: any }>()
  ),
  clearInventoryActions: createAction(
    '[Inventory] Clear action'
  )
}