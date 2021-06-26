import { Product } from './product';

export interface OrderItem {
  productId: string;
  productName: string;
  productDescription: string;
  productUnitPrice: number;
  quantity: number;
  
}