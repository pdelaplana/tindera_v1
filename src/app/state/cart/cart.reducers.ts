import { Action, createReducer, on } from '@ngrx/store';
import { cartActions } from './cart.actions';
import { cartItemAdapter } from './cart.adapter';
import { CartState } from './cart.state';

const initialCartState: CartState = 
{
  cartItems: cartItemAdapter.getInitialState({ selectedProductId: null })
}

const reducer = createReducer(
  initialCartState,
  on(cartActions.addToCart, (state, { cartItem }) => {
    return {
      ...state,
      cartItems: cartItemAdapter.upsertOne(cartItem, state.cartItems)
    }
  }),
  on(cartActions.clearCart, (state) => {
    return {
      ...state,
      cartItems: cartItemAdapter.removeAll(state.cartItems)
    }
  }),
  on(cartActions.removeItemFromCart, (state, { cartItem }) => {
    return {
      ...state,
      cartItems: cartItemAdapter.removeOne(cartItem.productId, state.cartItems)
    }
  }),
  
)

export function cartReducer(state: CartState | undefined, action: Action) {
  return reducer(state, action);
}