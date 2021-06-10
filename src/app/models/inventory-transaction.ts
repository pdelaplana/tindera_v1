import { Entity } from './entity';

export interface InventoryTransaction extends Entity{
  itemId: string;
  userId: string;
  transactionOn: Date;
  quantityIn: number,
  quantityOut: number,
  reference: string;
  notes: string;
}