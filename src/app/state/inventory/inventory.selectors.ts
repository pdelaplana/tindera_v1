import { InventoryItem } from '@app/models/inventory-item';
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

const groupByCategory = (array:InventoryItem[]): { category: string, inventoryItems: InventoryItem[]}[] => {
  return array
    .sort((a: InventoryItem, b: InventoryItem) => {
      return a.category?.sequence > b.category?.sequence ? 1 : -1;
    })
    .reduce((groups: { category: string, inventoryItems: InventoryItem[]}[], thisItem:  InventoryItem) => {
      let thisCategory = thisItem.category.description;
      if (thisCategory == null) thisCategory = 'None';
      let found = groups.find(group => group.category === thisCategory);
      if (found === undefined) {
        found = { category: thisCategory,inventoryItems: [] };
        groups.push(found);
      }
      found.inventoryItems.push(thisItem);
      return groups;
    }, [])
}


export const selectAllInventory = selectAll;

export const selectInventoryState = (state: AppState) => state.inventory;

export const selectAllAndGroupInventory = (searchTerm: string) =>
  createSelector(
    selectInventoryState,
    state => {
      let items = Object.entries(state.items.entities).map(([id, item]) => item);
      if (searchTerm)
        items = items.filter(item => item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 )
      return groupByCategory(items);
    }
  )

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

export const selectAllInventoryCounts = () =>
  createSelector(
    selectInventoryState,
    (state) => (Object.entries(state.counts.entities))
      .map(([id,count]) => count)
  );

export const selectInventoryCount = (id: string) => 
  createSelector(
    selectInventoryState,
    (state) => state.counts.entities[id]);