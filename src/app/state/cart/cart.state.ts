import { CartItem } from '@app/models/cart-item';
import { EntityState } from '@ngrx/entity';

export interface CartItemState extends EntityState<CartItem> {
  selectedProductId : string | null;
}

export interface CartState {
  cartItems: CartItemState;
}