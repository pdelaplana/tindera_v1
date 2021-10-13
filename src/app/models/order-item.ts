import { OrderItemAddon } from './order-item-addon';

export interface OrderItem {
  productId: string;
  productName: string;
  productDescription: string;
  productUnitPrice: number;
  productCategory: string;
  quantity: number;
  addons: OrderItemAddon[];
}