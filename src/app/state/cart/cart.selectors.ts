import { createSelector } from '@ngrx/store';
import { AppState } from '..';
import { selectInventoryState } from '../inventory/inventory.selectors';
import { cartItemAdapter } from './cart.adapter';

const adapter = cartItemAdapter;

const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();

export const selectAllCart = selectAll;

export const selectCartState = (state: AppState) => state.cart;

export const selectCartItems = ( ) =>
  createSelector(
    selectCartState,
    state => (Object.entries(state.cartItems.entities))
      .map(([id,cartItem]) => cartItem)
  );