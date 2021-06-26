import { PaymentType } from '@app/models/payment-type';
import { Action, createReducer, on } from '@ngrx/store';
import { ShopActions } from './shop.actions';
import { ShopState } from './shop.state';

const initialState: ShopState = {
  id: '',
  name: '',
  description: '',
  location: '',
  currencyCode: 'P',
  paymentTypes: [
    <PaymentType>{ code: 'CASH', description: 'Cash' },
    <PaymentType>{ code: 'PANDA', description: 'Food Panda' },
    <PaymentType>{ code: 'GRAB', description: 'Grabfood' },
  ]
};

const reducer = createReducer(
  initialState,
  on(ShopActions.createShopSuccess, (state, {id, name, description, location}) => ({
    ...state,
    id,
    name,
    description,
    location
  })),
  on(ShopActions.createShopFailed, (state) => ({
    ...state
  })),
  on(ShopActions.loadShopStateSuccess, (state, {id, name, description, location}) => ({
    ...state,
    id,
    name,
    description,
    location
  })),
  
);


export function shopReducer(state: ShopState | undefined, action: Action) {
  return reducer(state, action);
}
