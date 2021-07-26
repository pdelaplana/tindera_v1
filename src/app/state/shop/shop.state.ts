import { PaymentType } from '@app/models/payment-type';
import { ProductCategory } from '@app/models/product-category';

export interface ShopState {
  id: string;
  name: string;
  description: string;
  location: string;
  currencyCode: string;
  paymentTypes: PaymentType[];
  productCategories: ProductCategory[];
}