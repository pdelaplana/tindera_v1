import { Order } from '@app/models/order';
import { OrderItem } from '@app/models/order-item';
import { EntityState } from '@ngrx/entity';

export interface OrderState extends EntityState<Order> {
  selectedOrderId : string | null;
}