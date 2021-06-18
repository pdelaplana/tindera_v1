import { InventoryItem } from './inventory-item';
import { UnitOfMeasure } from './types';

export interface ProductItem {
  itemId: string;
  item: InventoryItem,
  quantity: number;
  uom: UnitOfMeasure;
}