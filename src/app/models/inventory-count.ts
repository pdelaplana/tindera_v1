import { Entity } from './entity';
import { User } from './user';

export interface InventoryCount extends Entity{
  itemId: string;
  itemName: string;
  countBy: User;
  countOn: Date | any;
  count: number,
  type: string,
  notes: string;
  archivedOn: Date | any;
}