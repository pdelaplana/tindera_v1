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
    props<{ product: Product, quantity: number }>()
  ),
  addToCartFail: createAction(
    '[Cart] Add to Cart Success',
    props<{ product: Product, quantity: number }>()
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
  completeOrder: createAction(
    '[Cart] Complete order'
  )
}