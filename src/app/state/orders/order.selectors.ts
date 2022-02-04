import { createSelector } from '@ngrx/store';
import { AppState } from '..';
import * as moment from 'moment';
import { Order } from '@app/models/order';
import { OrderItem } from '@app/models/order-item';

export const groupOrdersByProductCategory = (orders: Order[]) : 
  { productCategory: string, totalSale: number, totalQuantity: number, orderItems: OrderItem[]}[] => {
  const items = orders.map(p =>p.orderItems);
  return items
      .reduce((a,b,) => [...a, ...b], [])
      .sort((a: OrderItem, b: OrderItem) => {
        return a.productCategory > b.productCategory ? 1 : -1;
      })
      .reduce((groups: { productCategory: string, totalSale: number, totalQuantity: number,  orderItems: OrderItem[]}[], thisOrderItem: OrderItem) => {
        let thisProductCategory = thisOrderItem.productCategory;
        if (thisProductCategory == null) thisProductCategory = 'None';
        let found = groups.find(group => group.productCategory === thisProductCategory);
        if (found === undefined) {
          found = {productCategory: thisProductCategory, totalSale: 0, totalQuantity: 0,  orderItems:[] };
          groups.push(found);
        }
        found.totalSale += Number(thisOrderItem.productUnitPrice) * Number(thisOrderItem.quantity);
        found.totalQuantity += Number(thisOrderItem.quantity);
        found.orderItems.push(thisOrderItem);
        return groups;
      }, [])
      .slice(0,4)
}

export const groupOrdersByPaymentType = (orders:Order[]): { paymentType: string,  totalSale: number, orders: Order[]}[] => {
  const paymentTypes = [];
  
  return orders
    .sort((a: Order, b: Order) => {
      return a.paymentType?.code > b.paymentType?.code ? 1 : -1;
    })
    .reduce((groups: { paymentType: string,  totalSale: number, orders: Order[]}[], thisOrder: Order) => {
      let found = groups.find(group => group.paymentType == thisOrder.paymentType.description);
      if (found  === undefined){
        found = {
          paymentType: thisOrder.paymentType.description,
          totalSale: 0,
          orders: []
        };
        groups.push(found);
      }
      found.totalSale += Number(thisOrder.totalSale);

      return groups;
    }, []);

  
}



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

export const selectOrdersByDateRange = (fromDate: Date, toDate: Date) => 
  createSelector(
    selectAllOrders(),
    (orders: Order[]) => {
      const start = moment(fromDate).startOf('day');
      const end = moment(toDate).endOf('day');      
      return orders.filter(order => moment(order.orderDate.toDate()).isBetween(start, end));
    }
  );


export const selectOrdersBetweenDates = (toDate: Date, fromDate: Date) => 
  createSelector(
    selectAllOrders(),
    (state: Order[]) => {
      let uot: moment.unitOfTime.StartOf;
      let start = moment(toDate).startOf('day');
      let end = moment(fromDate).endOf('day');      
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


