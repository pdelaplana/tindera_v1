import { Order } from '@app/models/order';
import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';

export const orderAdapter: EntityAdapter<Order> = createEntityAdapter<Order>({
  selectId: (order: Order) => order.id,
  //sortComparer: function (a, b){  return a.name.localeCompare(b.name); }
});
