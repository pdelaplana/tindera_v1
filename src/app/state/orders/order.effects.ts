import { Injectable } from '@angular/core';
import { InventoryTransaction } from '@app/models/inventory-transaction';
import { InventoryTransactionType } from '@app/models/types';
import { User } from '@app/models/user';
import { CommonUIService } from '@app/services/common-ui.service';
import { OrderService } from '@app/services/firestore/order.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AppState } from '..';
import { selectAuthUser } from '../auth/auth.selectors';
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
  ) {
   
  }

  loadOrders = createEffect(() => this.actions.pipe(
    ofType(orderActions.loadOrders),
    switchMap(action => {
      const result = this.orderService.query([]);
      return result.pipe();
    }),
    map( arr => {
      return orderActions.loadOrdersSuccess({orders: arr})
    }),
    catchError((error, caught) => {
      this.store.dispatch(orderActions.loadOrdersFail({error}));
      return caught;
    })   
  ));

  createOrder = createEffect(() => this.actions.pipe(
    ofType(orderActions.createOrder),
    switchMap(async (action) => {
     const result = await this.orderService.add(action.order)
      return orderActions.createOrderSuccess({
        order: result
      })
    }),
    catchError((error, caught) => {
      this.store.dispatch(orderActions.createOrderFail({error}));
      return caught;
    })
  ));

  createOrderSuccess = createEffect(() => this.actions.pipe(
    ofType(orderActions.createOrderSuccess),
    switchMap(async (action) => {
      let transactions = [];
      const orderdId = action.order.id;
      
      action.order.orderItems.forEach(item => {
        const quantity = item.quantity;
        this.store.select(selectProduct(item.productId))
          .subscribe(product => {
            
            product.productItems.forEach(item => {
              transactions.push(<InventoryTransaction>{
                id:'',
                transactionType: InventoryTransactionType.Sale,
                itemId: item.itemId,
                transactionOn: new Date(),
                quantityIn: 0,
                quantityOut:  Number(item.quantity)*quantity,
                reference: `order=${action.order.id}`,
                notes: '',
              })       
            })

            item.addons.forEach(a =>
              transactions.push(<InventoryTransaction>{
                id:'',
                transactionType: InventoryTransactionType.Sale,
                itemId: a.itemId,
                transactionOn: new Date(),
                quantityIn: 0,
                quantityOut:  Number(a.quantity)*quantity,
                reference: `order=${action.order.id}`,
                notes: '',
              }) 
            )
        
          })
      });
      
      transactions.forEach(transaction => {
        this.store.dispatch(inventoryActions.updateInventoryBalance({transaction}))  
      })
      this.commonUiService.notify(`Order has been completed. You can browse this under Completed Orders under Sales. `)      
    }),
    catchError((error, caught) => {
      this.store.dispatch(inventoryActions.updateInventoryBalanceFail({error}));
      return caught;
    })
  ), { dispatch: false });

}