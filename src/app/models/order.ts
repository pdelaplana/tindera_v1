import { Entity } from './entity';
import { OrderItem } from './order-item';
import { PaymentType } from './payment-type';
import { User } from './user';

export interface Order extends Entity{
  orderDate: Date | any;
  totalSale: number;
  servedBy: User;
  dispatchedBy: User;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerReference: string;
  paymentType: PaymentType;
  paymentReceived: boolean;
  orderItems: OrderItem[];
}