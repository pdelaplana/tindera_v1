import { createSelector } from '@ngrx/store';
import { AppState } from '..';

export const selectProductState = (state: AppState) => state.products;

export const selectProduct = ( id: string) => 
  createSelector(
    selectProductState, 
    (state) => state.entities[id]
  );