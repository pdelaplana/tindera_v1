import { Entity } from './entity';
import { ProductAddOn } from './product-addon';
import { ProductItem } from './product-item';
import { ProductOption } from './product-option';

export interface Product extends Entity{
  code: string;
  name: string;
  description: string;
  tags: string[],
  remarks: string;
  price: number;
  productItems: ProductItem[];
  productAddOns: ProductAddOn[];
  productOptions: ProductOption[];
}