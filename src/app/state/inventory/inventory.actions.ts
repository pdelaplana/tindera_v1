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
    props<{ transaction: InventoryTransaction }>()
  ),
  receiveItemSuccess: createAction(
    '[Inventory] Receive item success',
    props<{ transaction: InventoryTransaction }>()
  ),
  receiveItemFail: createAction(
    '[Inventory] Receive item fail',
    props<{ error: any }>()
  ), 
  
}