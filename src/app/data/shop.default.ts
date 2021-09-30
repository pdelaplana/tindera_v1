import { InventoryAdjustmentReason } from '@app/models/inventory-adjustment-reason';
import { InventoryCategory } from '@app/models/inventory-category';
import { PaymentType } from '@app/models/payment-type';
import { ProductCategory } from '@app/models/product-category';
import { InventoryAdjustmentType } from '@app/models/types';

export const shopData = {
  default : {
    currencyCode: 'P',
    paymentTypes: [
      <PaymentType>{ code: 'CASH', description: 'Cash' },
      <PaymentType>{ code: 'PANDA', description: 'Food Panda' },
      <PaymentType>{ code: 'GRAB', description: 'Grabfood' },
    ],
    productCategories: [
      <ProductCategory>{ code: 'SHRIMP', description: 'Shrimp Tempura', sequence: 1 },
      <ProductCategory>{ code: 'TEMPURA', description: 'Tempura', sequence:2 },
      <ProductCategory>{ code: 'GLAZED', description: 'Glazed Series', sequence:3 },
      <ProductCategory>{ code: 'FAMILY', description: 'Family Bucket', sequence:4 },
      <ProductCategory>{ code: 'DRINKS', description: 'Drinks', sequence:5 },
    ],
    inventoryCategories: [
      <InventoryCategory>{ code: 'MEATS', description: 'Meat', sequence: 1},
      <InventoryCategory>{ code: 'SEAFOODS', description: 'Seafoods', sequence: 2},
      <InventoryCategory>{ code: 'SAUCES', description: 'Sauces', sequence: 3},
      <InventoryCategory>{ code: 'GROCERIES', description: 'Groceries', sequence: 4},
      <InventoryCategory>{ code: 'DRYGOODS', description: 'Dry Goods', sequence: 5},
    ],
    inventoryAdjustmentReasons:[
      <InventoryAdjustmentReason>{ code: 'SPOILAGE', description: 'Spoilage', adjustmentType: InventoryAdjustmentType.Decrease},
      <InventoryAdjustmentReason>{ code: 'THEFT', description: 'Theft', adjustmentType: InventoryAdjustmentType.Decrease},
      <InventoryAdjustmentReason>{ code: 'DAMAGE', description: 'Damage', adjustmentType: InventoryAdjustmentType.Decrease},
      <InventoryAdjustmentReason>{ code: 'COUNTIN', description: 'Stock Count In', adjustmentType: InventoryAdjustmentType.Increase},
      <InventoryAdjustmentReason>{ code: 'COUNTOUT', description: 'Stock Count Out', adjustmentType: InventoryAdjustmentType.Decrease},
      <InventoryAdjustmentReason>{ code: 'RETURNS', description: 'Customer Returns', adjustmentType: InventoryAdjustmentType.Increase},
    ]
  }
}