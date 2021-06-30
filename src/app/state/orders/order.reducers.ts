import { Action, createReducer, on } from '@ngrx/store';
import { orderActions } from './order.actions';
import { orderAdapter } from './order.adapter';
import { OrderState } from './order.state';

const initialOrderState: OrderState =  orderAdapter.getInitialState({ selectedOrderId: null});

const reducer = createReducer(
  initialOrderState,
  on(orderActions.loadOrdersSuccess, (state, { orders }) => {
    return orderAdapter.upsertMany(orders, state)
  }),
  on(orderActions.createOrderSuccess, (state, { order }) => {
    return orderAdapter.addOne(order, state);
  }),
 
)

export function orderReducer(state: OrderState | undefined, action: Action) {
  return reducer(state, action);
}