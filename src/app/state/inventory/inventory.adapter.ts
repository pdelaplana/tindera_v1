import { InventoryItem } from '@app/models/inventory-item';
import { InventoryTransaction } from '@app/models/inventory-transaction';
import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';

export const inventoryItemAdapter : EntityAdapter<InventoryItem> = createEntityAdapter<InventoryItem>({ 
  selectId: (item: InventoryItem) => item.id,
  //sortComparer: function (a, b){  return a.name.localeCompare(b.name); }
});

export const inventoryTransactionAdapter : EntityAdapter<InventoryTransaction> = createEntityAdapter<InventoryTransaction>({
  selectId: (transaction: InventoryTransaction) => transaction.id
});