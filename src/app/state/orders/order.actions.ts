import { Order } from '@app/models/order';
import { createAction, props } from '@ngrx/store';

export const orderActions = {
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