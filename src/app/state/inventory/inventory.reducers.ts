import { InventoryState } from './inventory.state';
import { inventoryActions } from './inventory.actions';
import { Action, createReducer,  on } from '@ngrx/store';
import { inventoryCountAdapter, inventoryItemAdapter, inventoryTransactionAdapter } from './inventory.adapter';

const initialInventoryState: InventoryState = 
{
  items: inventoryItemAdapter.getInitialState({ selectedInventoryItemId: null}),
  transactions: inventoryTransactionAdapter.getInitialState({ selectedInventoryTransactionId: null }),
  counts: inventoryCountAdapter.getInitialState({ selectedInventoryCountId: null})
}


const reducer = createReducer(
  initialInventoryState,
  on(inventoryActions.createItemSuccess, (state, { item }) => {
    return {
      ...state,
      items: inventoryItemAdapter.addOne(item, state.items)
    }
  }),
  on(inventoryActions.loadInventorySuccess, (state, { items }) => {
    return {
      ...state,
      items: inventoryItemAdapter.setAll(items, state.items)
    } 
  }),
  on(inventoryActions.updateItemSuccess, (state, { update }) => {
    return {
      ...state,
      items: inventoryItemAdapter.updateOne(update, state.items)
    }
  }),
  on(inventoryActions.loadTransactionsSuccess, (state, { transactions }) => {
    return {
      ...state,
      transactions: inventoryTransactionAdapter.upsertMany(transactions, state.transactions)
    } 
  }),
  on(inventoryActions.loadItemTransactionsSuccess, (state, { transactions }) => {
    return {
      ...state,
      transactions: inventoryTransactionAdapter.upsertMany(transactions, state.transactions)
    } 
  }),
  on(inventoryActions.receiveItemSuccess, (state, {transaction })=> {
    return {
      ...state,
      transactions: inventoryTransactionAdapter.addOne(transaction, state.transactions)
    }
  }),
  on(inventoryActions.updateInventoryBalanceSuccess, (state, {transaction })=> {
    return {
      ...state,
      transactions: inventoryTransactionAdapter.addOne(transaction, state.transactions)
    }
  }),
  on(inventoryActions.loadCountsSuccess, (state, { counts }) => {
    return {
      ...state,
      counts: inventoryCountAdapter.setAll(counts, state.counts)
    } 
  }),
  on(inventoryActions.submitCountSuccess, (state, { count }) => {
    return {
      ... state,
      counts: inventoryCountAdapter.addOne(count, state.counts)
    }
  }),
  on(inventoryActions.archiveCountSuccess, (state, { update }) => {
    return {
      ... state,
      counts: inventoryCountAdapter.updateOne(update, state.counts)
    }
  })
  
 
);

export function inventoryReducer(state: InventoryState | undefined, action: Action) {
  return reducer(state, action);
}