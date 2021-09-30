import { Entity } from './entity';
import { InventoryAdjustmentReason } from './inventory-adjustment-reason';
import { InventoryCategory } from './inventory-category';
import { PaymentType } from './payment-type';
import { ProductCategory } from './product-category';
import { User } from './user';

export interface Shop extends Entity  {
  name: string;
  description: string;
  location: string;
  currencyCode:string;
  paymentTypes: PaymentType[];
  productCategories: ProductCategory[];
  inventoryCategories: InventoryCategory[];
  inventoryAdjustmentReasons: InventoryAdjustmentReason[];
  userIds: string[];
  users: User[];
}