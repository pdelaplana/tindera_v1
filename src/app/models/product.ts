import { Entity } from './entity';
import { ProductAddOn } from './product-addon';
import { ProductCategory } from './product-category';
import { ProductItem } from './product-item';
import { ProductOption } from './product-option';

export interface Product extends Entity{
  name: string;
  description: string;
  tags: string[],
  remarks: string;
  price: number;
  productCategory: ProductCategory;
  productItems: ProductItem[];
  productAddOns: ProductAddOn[];
  productOptions: ProductOption[];
  imageUrl: string;
}