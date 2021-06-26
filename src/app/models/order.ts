import { Entity } from './entity';
import { OrderItem } from './order-item';
import { PaymentType } from './payment-type';

export interface Order extends Entity{
  orderDate: Date;
  totalSale: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerReference: string;
  paymentType: PaymentType;
  paymentReceived: boolean;
  orderItems: OrderItem[];
}