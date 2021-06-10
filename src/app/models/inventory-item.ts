import { Entity } from './entity';
import { UnitOfMeasure } from './types';

export interface InventoryItem extends Entity{
  name: string;
  description: string;
  category: string;
  uom: UnitOfMeasure,
  unitCost: number,
  currentCount: number;
  reorderLevel: number;
  notes: string;
}