import { InventoryState } from './inventory.state';
import { inventoryActions } from './inventory.actions';
import { Action, createReducer,  on } from '@ngrx/store';
import { inventoryItemAdapter, inventoryTransactionAdapter } from './inventory.adapter';

const initialInventoryState: InventoryState = 
{
  items: inventoryItemAdapter.getInitialState({ selectedInventoryItemId: null}),
  transactions: inventoryTransactionAdapter.getInitialState({ selectedInventoryTransactionId: null })
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
  })
  
 
);

export function inventoryReducer(state: InventoryState | undefined, action: Action) {
  return reducer(state, action);
}