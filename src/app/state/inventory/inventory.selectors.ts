import {  createSelector, select } from '@ngrx/store';
import { startWith } from 'rxjs/operators';
import { AppState } from '..';
import { inventoryItemAdapter, inventoryTransactionAdapter } from './inventory.adapter';
import { InventoryState } from './inventory.state';

const adapter = inventoryItemAdapter;

const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();

export const selectAllInventory = selectAll;

//export const selectInventoryState = createFeatureSelector<InventoryState>('inventory');
export const selectInventoryState = (state: AppState) => state.inventory;

export const selectInventoryTransactions = (id: string ) =>
  createSelector(
    selectInventoryState,
    (state) => state.transactions.entities
  );

export const selectInventoryItem = ( id: string) => 
  createSelector(
    selectInventoryState, 
    (state) => state.items.entities[id]);


export const selectItemTransactions = ( id: string) =>
  createSelector(
    selectInventoryState,
    //state => Object.keys(state.transactions.entities).filter(t => t.)
    state => (Object.entries(state.transactions.entities))
      .filter(([id,transaction]) => transaction.itemId == id)
      .map(([id,transaction]) => transaction)
  );
