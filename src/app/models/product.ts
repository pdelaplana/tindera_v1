import { Entity } from './entity';
import { ProductItem } from './product-item';

export interface Product extends Entity{
  code: string;
  name: string;
  description: string;
  tags: string[],
  remarks: string;
  price: number;
  productItems: ProductItem[];
}