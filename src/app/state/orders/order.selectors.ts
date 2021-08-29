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
      let start: any;
      let end: any;
      switch (period){
        case 'yesterday':
          uot = 'day';
          start = moment().subtract(1, 'day').startOf(uot);
          end = moment().subtract(1, 'day').endOf(uot);
          break;
        case 'today':
          uot = 'day';
          start = moment().startOf(uot);
          end = moment().endOf(uot);
          break;
        case 'thisWeek':
          uot = 'week';
          start = moment().startOf(uot);
          end = moment().endOf(uot);
          break;
        case 'thisMonth':
          uot = 'month';
          start = moment().startOf(uot);
          end = moment().endOf(uot);
          break;
        case 'thisYear':
          uot = 'year';
          start = moment().startOf(uot);
          end = moment().endOf(uot);
          break;
        case 'last7Days':
          uot = 'day';
          start = moment().add(1, 'day').subtract(7, 'day').startOf(uot);
          end = moment().endOf(uot);
          break;
            
        case 'lastMonth':
          uot = 'month';
          start = moment().add(-1, 'month').startOf(uot);
          end = moment().add(-1, 'month').endOf(uot);
          break;
        case 'last3Months':
          uot = 'month';
          start = moment().add(-3, 'month').startOf(uot);
          end = moment().endOf(uot);
          break;
        case 'last6Months':
            uot = 'month';
            start = moment().add(-6, 'month').startOf(uot);
            end = moment().endOf(uot);
            break;
      };
      return state.filter(order => moment(order.orderDate.toDate()).isBetween(start, end));
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

export const selectBestSellingProducts = (period:string) =>
  createSelector(
    selectOrdersByPeriod(period),
    (orders) => orders
      .map(order => order.orderItems.map(item => item))
      .map(items => items)
  );


