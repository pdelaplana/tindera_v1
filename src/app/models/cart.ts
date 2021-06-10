import { CartItem } from './cart-item';

export interface Cart{
  total: number;
  items: CartItem[];
}