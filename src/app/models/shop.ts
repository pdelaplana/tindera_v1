import { Entity } from './entity';
import { PaymentType } from './payment-type';

export interface Shop extends Entity  {
  name: string;
  description: string;
  location: string;
  currencyCode:string;
  paymentTypes: PaymentType[];
}