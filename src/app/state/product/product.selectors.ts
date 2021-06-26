import { createSelector } from '@ngrx/store';
import { AppState } from '..';

export const selectProductState = (state: AppState) => state.products;

export const selectAllProducts = () => 
  createSelector(
    selectProductState,
    state => 
      Object.entries(state.entities).map(([id,product]) => product)
  );

export const selectProduct = ( id: string) => 
  createSelector(
    selectProductState, 
    (state) => state.entities[id]
  );

  