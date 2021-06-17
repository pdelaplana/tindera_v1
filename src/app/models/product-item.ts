import { Entity } from './entity';
import { UnitOfMeasure } from './types';

export interface ProductItem {
  itemId: string;
  item: ProductItem,
  quantity: number;
  uom: UnitOfMeasure;
}