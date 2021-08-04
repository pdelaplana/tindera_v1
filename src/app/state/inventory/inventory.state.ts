import { InventoryCount } from '@app/models/inventory-count';
import { InventoryItem } from '@app/models/inventory-item';
import { InventoryTransaction } from '@app/models/inventory-transaction';
import { EntityState } from '@ngrx/entity';

export interface InventoryItemState extends EntityState<InventoryItem> { 
  selectedInventoryItemId : string | null;
}

export interface InventoryTransactionState extends EntityState<InventoryTransaction> { 
  selectedInventoryTransactionId : string | null;
}

export interface InventoryCountState extends EntityState<InventoryCount> { 
  selectedInventoryCountId : string | null;
}


export interface InventoryState {
  items: InventoryItemState,
  transactions: InventoryTransactionState,
  counts: InventoryCountState
} 