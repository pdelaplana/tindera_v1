import { Entity } from './entity';
import { InventoryCategory } from './inventory-category';
import { UnitOfMeasure } from './types';

export interface InventoryItem extends Entity{
  name: string;
  description: string;
  category: InventoryCategory;
  uom: UnitOfMeasure,
  unitCost: number,
  currentCount: number;
  reorderLevel: number;
  notes: string;
  qtyReceivedToDate: number,
  costOfQtyReceivedToDate: number
}

