import { CartItem } from '@app/models/cart-item';
import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';

export const cartItemAdapter : EntityAdapter<CartItem> = createEntityAdapter<CartItem>({ 
  selectId: (item: CartItem) => item.productId,
  //sortComparer: function (a, b){  return a.name.localeCompare(b.name); }
});