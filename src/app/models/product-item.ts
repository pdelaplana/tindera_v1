import { InventoryItem } from './inventory-item';
import { UnitOfMeasure } from './types';

export interface ProductItem {
  itemId: string;
  itemName: string;
  unitCost: number;
  quantity: number;
  uom: UnitOfMeasure;
}