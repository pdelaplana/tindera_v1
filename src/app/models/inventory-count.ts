import { Entity } from './entity';
import { InventoryCountItem } from './inventory-count-item';
import { User } from './user';

export interface InventoryCount extends Entity{
  countOn: Date | any;
  user: User;
  type: string,
  notes: string;
  submittedOn: Date | any;
  archivedOn: Date | any;
  countItems: InventoryCountItem[]; 
}