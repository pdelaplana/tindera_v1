export enum InventoryTransactionType {
  Receipt = 'receipt',
  Issue = 'issue',
  Sale = 'sale',
  Adjustment = 'adjustment',
  CountAdjustment = 'countAdjustment',

}

export enum UnitOfMeasure { 
  Piece = 'piece',
  Ounce = 'ounce', 
  Liter = 'liter' 
}

export enum InventoryAdjustmentType{
  Increase = 'incrase',
  Decrease = 'decrease'
}

export const countTypes = [
  'End of Day',
  'Start of Day',
  'Cycle',
  'Adhoc',
  'Stocktake'
];

export const inventoryAdjustmentReasons = [
  'Spoilage',
  'Theft',
  'Returns',
  'Damage',
  'Stock Count In',
  'Stock Count Out'
]

