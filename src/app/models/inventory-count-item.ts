import { User } from './user';

export interface InventoryCountItem {
  itemId: string;
  itemName: string;
  category:string;
  onHand: number;
  countedOn: Date | any;
  countedBy: User;
  counted: number,
  notes: string;
  adjustedOn: Date | any;
}