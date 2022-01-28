import { InventoryItem } from '@app/models/inventory-item';
import {  createSelector } from '@ngrx/store';
import { AppState } from '..';
import { inventoryItemAdapter } from './inventory.adapter';
import * as moment from 'moment';

const adapter = inventoryItemAdapter;

const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();

const groupByCategory = (array:InventoryItem[]): { description: string, onhandQty: number, inventoryItems: InventoryItem[]}[] => {
  return array
    .sort((a: InventoryItem, b: InventoryItem) => {
      return a.category?.sequence > b.category?.sequence ? 1 : -1;
    })
    .reduce((groups: { description: string, onhandQty: number, inventoryItems: InventoryItem[]}[], thisItem:  InventoryItem) => {
      let thisCategory = thisItem.category.description;
      if (thisCategory == null) thisCategory = 'None';
      let found = groups.find(group => group.description === thisCategory);
      if (found === undefined) {
        found = { description: thisCategory,  onhandQty: 0, inventoryItems: [] };
        groups.push(found);
      }
      found.onhandQty += Number(thisItem.currentCount);
      found.inventoryItems.push(thisItem);
      return groups;
    }, [])
}


export const selectInventoryState = (state: AppState) => state.inventory;

export const selectAllInventory = selectAll;

export const selectInventory = (searchTerm:string|null) =>
  createSelector(
    selectInventoryState,
    state => {
      let items = Object.entries(state.items.entities).map(([id, item]) => item);
      if (searchTerm)
        items = items.filter(item => item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 )
      return items;
    }
  )

export const selectInventoryItems = () =>
  createSelector(
    selectInventoryState,
    state => {
      return  Object.entries(state.items.entities).map(([id, item]) => item);
    }
  )


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

export const selectInventoryTransactions = () => 
  createSelector(
    selectInventoryState,
    state => 
      Object.entries(state.transactions.entities).map(([id,transaction]) => transaction)
  );

export const selectInventoryTransactionsOfItem = (id: string ) =>
  createSelector(
    selectInventoryTransactions(),
    (transactions) => {
      return transactions.filter(transaction => transaction.itemId == id);
    }
  );

export const selectInventoryTransactionsByDateRange = (fromDate: Date, toDate: Date) =>
  createSelector(
    selectInventoryTransactions(),
    (transactions) => {
      const start = moment(fromDate).startOf('day');
      const end = moment(toDate).endOf('day');
      return transactions.filter(transaction => moment(transaction.transactionOn.toDate()).isBetween(start,end));
    }
  );

export const selectInventoryItemTransactions = (itemId: string, fromDate: Date, toDate: Date) =>
  createSelector(
    selectInventoryTransactions(),
    (transactions) => {
      if ((fromDate != undefined) && (toDate != undefined)){
        return transactions.filter(transaction => 
          transaction.itemId == itemId 
          && moment(transaction.transactionOn.toDate()).isBetween(moment(fromDate),moment(toDate)));
      } else {
        return transactions.filter(transaction => 
          transaction.itemId == itemId 
          );
      }
    }
  );

export const selectInventoryTransaction = (transactionId: string) =>
  createSelector(
    selectInventoryTransactions(),
    (transactions) => {
      return transactions.find(transaction => 
        transaction.id == transactionId 
      );
    }
  );


export const selectInventoryItem = ( id: string) => 
  createSelector(
    selectInventoryState, 
    (state) => state.items.entities[id]);


export const selectItemTransactions = ( id: string) =>
  createSelector(
    selectInventoryState,
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

export const selectInventoryForReorder = () =>
    createSelector(
      selectInventoryState,
      (state) => (Object.entries(state.items.entities))
        .map(([id, item]) => item)
        .filter(item => item.currentCount <= item.reorderLevel)
        .sort((a: InventoryItem, b: InventoryItem) => {
          return a.currentCount > b.currentCount ? 1 : -1;
        })
    );