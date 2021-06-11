import { Entity } from './entity';
import { InventoryTransactionType } from './types';

export interface InventoryTransaction extends Entity{
  transactionType: InventoryTransactionType,
  itemId: string;
  userId: string;
  transactionOn: Date;
  quantityIn: number,
  quantityOut: number,
  reference: string;
  notes: string;
}