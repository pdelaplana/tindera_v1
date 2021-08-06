import { InventoryAdjustmentType } from './types';

export interface InventoryAdjustmentReason{
  code: string;
  description: string;
  adjustmentType: InventoryAdjustmentType;
}

