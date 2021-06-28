import { createSelector } from '@ngrx/store';
import { AppState } from '..';

export const selectOrderState = (state: AppState) => state.orders;

export const selectAllOrders = () => 
  createSelector(
    selectOrderState,
    state => 
      Object.entries(state.entities).map(([id,product]) => product)
  );

export const selectOrder = ( id: string) => 
  createSelector(
    selectOrderState, 
    (state) => state.entities[id]
  );