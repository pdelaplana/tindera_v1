import { CartItem } from '@app/models/cart-item';
import { Product } from '@app/models/product';
import { createAction, props } from '@ngrx/store';

export const cartActions = {
  addToCart: createAction(
    '[Cart] Add to Cart',
    props<{ cartItem: CartItem }>()
  ),
  addToCartSuccess: createAction(
    '[Cart] Add to Cart Success',
    props<{ cartItem: CartItem }>()
  ),
  addToCartFail: createAction(
    '[Cart] Add to Cart fail',
    props<{ error: any}>()
  ),
  clearCart: createAction(
    '[Cart] Clear cart'
  ),
  clearCartSuccess: createAction(
    '[Cart] Clear cart success'
  ),
  clearCartFail: createAction(
    '[Cart] Clear cart fail'
  ),
  removeItemFromCart: createAction(
    '[Cart] Remove item from cart',
    props<{ cartItem: CartItem}>()
  ),
  removeItemFromCartSuccess: createAction(
    '[Cart] Remove item from cart success',
    props<{ cartItem: CartItem}>()
  ),
  removeItemFromFail: createAction(
    '[Cart] Remove item from cart fail'
  ),
  modifyItemInCart: createAction(
    '[Cart] Modify item in cart'
  ),
  checkoutCartItems: createAction(
    '[Cart] Checkout cart items',
  ),
  checkoutCartItemsSuccess: createAction(
    '[Cart] Checkout cart items success',
  ),
  checkoutCartItemsFail: createAction(
    '[Cart] Checkout cart items fail',
    props<{ error: any }>()
  ),
  completeOrder: createAction(
    '[Cart] Complete order'
  )
}