import { PaymentType } from '@app/models/payment-type';

export interface ShopState {
  id: string;
  name: string;
  description: string;
  location: string;
  currencyCode: string;
  paymentTypes: PaymentType[];
}