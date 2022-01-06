import { Entity } from './entity';
import { InventoryAdjustmentReason } from './inventory-adjustment-reason';
import { InventoryTransactionType } from './types';

export interface InventoryTransaction extends Entity{
  transactionType: InventoryTransactionType;
  itemId: string;
  itemName: string;
  userId: string;
  transactionOn: Date | any;
  quantityIn: number;
  quantityOut: number;
  reference: string;
  notes: string;
  adjustmentReason: InventoryAdjustmentReason;
  unitCost: number;
  supplier: string;
}