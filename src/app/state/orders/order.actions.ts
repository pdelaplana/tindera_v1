import { Order } from '@app/models/order';
import { OrderListPage } from '@app/pages/sales/order-list/order-list.page';
import { createAction, props } from '@ngrx/store';

export const orderActions = {
  loadOrders: createAction(
    '[Order] Load orders',
    props<{ shopid: string }>()
  ),
  loadOrdersSuccess: createAction(
    '[Order] Load orders success',
    props<{ orders: Order[] }>()
  ),
  loadOrdersFail: createAction(
    '[Order] Load orders fail',
    props<{ error: any }>()
  ),
  createOrder: createAction(
    '[Order] Create order',
    props<{ order: Order }>()
  ),
  createOrderSuccess: createAction(
    '[Order] Create order success',
    props<{ order: Order }>()
  ),
  createOrderFail: createAction(
    '[Order] Create order fail',
    props<{ error: any }>()
  ),
}