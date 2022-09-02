import { NGXLogger } from 'ngx-logger';

import {
  Action,
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';

import * as fromAuthReducer from '@app/state/auth/auth.reducers';
// import * as fromStoreReducer from '@app/state/store/store.reducers';

import { AuthState } from '@app/state/auth/auth.state';
import { ShopState } from './shop/shop.state';
import { shopReducer } from './shop/shop.reducers';
import { inventoryReducer } from './inventory/inventory.reducers';
import { InventoryState } from './inventory/inventory.state';
import { productReducer } from './product/product.reducers';
import { ProductState } from './product/product.state';
import { cartReducer } from './cart/cart.reducers';
import { CartState } from './cart/cart.state';
import { OrderState } from './orders/order.state';
import { orderReducer } from './orders/order.reducers';


export interface AppState {
  auth: AuthState;
  shop: ShopState;
  inventory: InventoryState;
  products: ProductState;
  orders: OrderState;
  cart: CartState;
}

export function loggerFactory(logger: NGXLogger): MetaReducer<AppState> {
  return (reducer: ActionReducer<AppState, Action>) => (state, action) => {
      logger.info('action', action);
      logger.debug('state', state);
      return reducer(state, action);
    };
}



export const reducers: ActionReducerMap<AppState> = {
  auth: fromAuthReducer.reducer,
  shop: shopReducer,
  inventory: inventoryReducer,
  products: productReducer,
  orders: orderReducer,
  cart: cartReducer
};


export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];



