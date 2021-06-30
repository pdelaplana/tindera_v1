import { createSelector } from '@ngrx/store';
import { AppState } from '..';
import * as moment from 'moment';
import {unitOfTime} from 'moment';
import { Order } from '@app/models/order';


export const selectOrderState = (state: AppState) => state.orders;


export const selectOrder = ( id: string) => 
  createSelector(
    selectOrderState, 
    (state) => state.entities[id]
  );

export const selectAllOrders = () => 
  createSelector(
    selectOrderState,
    state => 
      Object.entries(state.entities).map(([id,order]) => order)
  );

export const selectOrdersByPeriod = (period: string) => 
  createSelector(
    selectAllOrders(),
    (state: Order[]) => {
      let uot: moment.unitOfTime.StartOf;
      switch (period){
        case 'today':
          uot = 'day';
          break;
        case 'thisWeek':
          uot = 'week';
          break;
        case 'thisMonth':
          uot = 'month';
          break;
        case 'thisYear':
          uot = 'year';
          break;
      };
      return state.filter(order => moment(order.orderDate.toDate()).isBetween(moment().startOf(uot), moment().endOf(uot)));
    }
  );

export const selectOrdersToday = () => 
  createSelector(
    selectOrderState,
    (state) => Object.entries(state.entities)
      .map(([id,order]) => order)
      .filter(order => moment().endOf('day').isSame(moment(order.orderDate.toDate()).endOf('day')))
  )

  export const selectOrdersThisWeek = () => 
    createSelector(
      selectAllOrders(),
      (state: Order[]) => state.filter(order => moment(order.orderDate.toDate()).isBetween(moment().startOf('W'), moment().endOf('W')))
    );
