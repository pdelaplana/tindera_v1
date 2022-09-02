/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { InventoryTransaction } from '@app/models/inventory-transaction';
import { InventoryTransactionType } from '@app/models/types';
import { CommonUIService } from '@app/services/common-ui.service';
import { OrderService } from '@app/services/firestore/order.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { AppState } from '..';
import { inventoryActions } from '../inventory/inventory.actions';
import { selectProduct } from '../product/product.selectors';
import { orderActions } from './order.actions';

@Injectable()
export class OrderEffects{
  constructor(
    private store: Store<AppState>,
    private actions: Actions,
    private commonUiService: CommonUIService,
    private orderService: OrderService
  ) { }

  loadOrders = createEffect(() => this.actions.pipe(
    ofType(orderActions.loadOrders),
    switchMap(action => {
      const result = this.orderService.query([]);
      return result.pipe();
    }),
    map( arr => orderActions.loadOrdersSuccess({orders: arr})),
    catchError((error, caught) => {
      this.store.dispatch(orderActions.loadOrdersFail({error}));
      return caught;
    })
  ));

  loadOrdersByDate = createEffect(() => this.actions.pipe(
    ofType(orderActions.loadOrdersByDate),
    mergeMap(action => {
      const result = this.orderService.getOrdersByDate(action.fromDate, action.toDate);
      return result.pipe();
    }),

    map( arr => orderActions.loadOrdersSuccess({orders: arr})),

    catchError((error, caught) => {
      this.store.dispatch(orderActions.loadOrdersFail({error}));
      return caught;
    })
  ));


  createOrder = createEffect(() => this.actions.pipe(
    ofType(orderActions.createOrder),
    switchMap(async (action) => {
     const result = await this.orderService.add(action.order);
      return orderActions.createOrderSuccess({
        order: result
      });
    }),
    catchError((error, caught) => {
      this.store.dispatch(orderActions.createOrderFail({error}));
      return caught;
    })
  ));

  createOrderSuccess = createEffect(() => this.actions.pipe(
    ofType(orderActions.createOrderSuccess),
    switchMap(async (action) => {
      const transactions = [];
      const orderdId = action.order.id;

      action.order.orderItems.forEach(orderItem => {
        const quantity = orderItem.quantity;
        this.store.select(selectProduct(orderItem.productId))
          .subscribe(product => {

            product.productItems.forEach(productItem => {
              transactions.push(<InventoryTransaction>{
                id:'',
                transactionType: InventoryTransactionType.Sale,
                itemId: productItem.itemId,
                itemName: productItem.itemName,
                transactionOn: new Date(),
                quantityIn: 0,
                quantityOut:  Number(productItem.quantity)*quantity,
                reference: `order=${action.order.id}`,
                notes: '',
                //unitCost: Number(inventoryItem.unitCost),
              });
            });

            orderItem.addons.forEach(addon =>
              transactions.push(<InventoryTransaction>{
                id:'',
                transactionType: InventoryTransactionType.Sale,
                itemId: addon.itemId,
                itemName: addon.name,
                transactionOn: new Date(),
                quantityIn: 0,
                quantityOut:  Number(addon.quantity)*quantity,
                reference: `order=${action.order.id}`,
                notes: '',
                //unitCost: Number(inventoryItem.unitCost)
              })

            );

          });
      });

      transactions.forEach(transaction => {
        this.store.dispatch(inventoryActions.updateInventoryBalance({transaction}))  ;
      });
      this.store.dispatch(inventoryActions.clearInventoryActions());
      this.commonUiService.notify(`Order has been completed. You can browse this under Completed Orders under Sales. `);
    }),
    catchError((error, caught) => {
      this.store.dispatch(inventoryActions.updateInventoryBalanceFail({error}));
      return caught;
    })
  ), { dispatch: false });

}
