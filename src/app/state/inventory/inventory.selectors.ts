import {  createSelector } from '@ngrx/store';
import { AppState } from '..';
import { inventoryItemAdapter } from './inventory.adapter';
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


export const selectInventoryItem = ( id: string) => 
  createSelector(
    selectInventoryState, 
    (state) => state.items.entities[id]);
