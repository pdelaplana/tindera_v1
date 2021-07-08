import { CartItemAddon } from './cart-item-addon';
import { Product } from './product';

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  amount: number;
  addons: CartItemAddon[];
}
