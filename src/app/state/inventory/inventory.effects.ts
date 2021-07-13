import { Injectable } from '@angular/core';
import { InventoryItem } from '@app/models/inventory-item';
import { InventoryTransaction } from '@app/models/inventory-transaction';
import { InventoryTransactionType } from '@app/models/types';
import { CommonUIService } from '@app/services/common-ui.service';
import { InventoryTransactionService } from '@app/services/firestore/inventory-transaction.service';
import { InventoryService } from '@app/services/firestore/inventory.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { catchError, concatMap, debounceTime, map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { AppState } from '..';
import { inventoryActions } from './inventory.actions';

@Injectable()
export class InventoryEffects{
  private uid: string;
  private shopid: string;
  constructor(
    private store: Store<AppState>,
    private actions: Actions,
    private commonUiService: CommonUIService,
    private inventoryService: InventoryService,
    private inventoryTransactionService: InventoryTransactionService
  ) {
    this.store.select(state => state.auth.uid).subscribe(uid => this.uid = uid);
    
    this.store.select(state => state.shop.id).subscribe(
      shopid => this.shopid = shopid
    );
     
  }

  loadInventory = createEffect(() => this.actions.pipe(
    ofType(inventoryActions.loadInventory),
    switchMap(action => {
      const result = this.inventoryService.query([]);
      return result.pipe()
    }),

    map( arr => {
      return inventoryActions.loadInventorySuccess({items: arr})
    }),

    catchError((error, caught) => {
      this.store.dispatch(inventoryActions.loadInventoryFail({error}));
      return caught;
    })
  ));

  createItem = createEffect(() => this.actions.pipe(
    ofType(inventoryActions.createItem),
    switchMap(async (action) => {
      const data = <InventoryItem>{
        id:'',
        name: action.item.name,
        description: action.item.description,
        category: action.item.category,
        currentCount: action.item.currentCount,
        reorderLevel: action.item.reorderLevel,
        unitCost: action.item.unitCost,
        uom: action.item.uom,
        notes: action.item.notes
      }
      const result = await this.inventoryService.add(data)
      return inventoryActions.createItemSuccess({
        item: result
      })
    }),
    catchError((error, caught) => {
      this.store.dispatch(inventoryActions.createItemFail({error}));
      return caught;
    })
  ));

  createItemSuccess = createEffect(() => this.actions.pipe(
    ofType(inventoryActions.createItemSuccess),
    map((action) => {
      this.commonUiService.notify('New inventory item created');
    })
  ), { dispatch: false });

  createItemFail = createEffect(() => this.actions.pipe(
    ofType(inventoryActions.createItemFail),
    map((action) => {
      this.commonUiService.notify('Opps. We are aunable to create an invenotry item.  Please try again');
    })  
  ), { dispatch: false });

  updateItem = createEffect(() => this.actions.pipe(
    ofType(inventoryActions.updateItem),
    //withLatestFrom(this.store),
    debounceTime(500),
    switchMap(async (action, state) => {
     
      const data = <InventoryItem>{
        id:action.item.id,
        name: action.item.name,
        description: action.item.description,
        category: action.item.category,
        currentCount: action.item.currentCount,
        reorderLevel: action.item.reorderLevel,
        unitCost: action.item.unitCost,
        uom: action.item.uom,
        notes: action.item.notes
      }
      const item = await (this.inventoryService.update(data));

      return inventoryActions.updateItemSuccess({
        update: {
          id: item.id,
          changes: { 
            name: item.name,
            description: item.description,
            category: item.category,
            uom: item.uom,
            unitCost: item.unitCost,
            reorderLevel: item.reorderLevel,
            currentCount: item.currentCount,
            notes: item.notes
          }
        } 
      })

    }),
    catchError((error, caught) => {
      this.store.dispatch(inventoryActions.updateItemFail({error}));
      return caught;
    })
  
  ));

  updateItemSuccess = createEffect(() => this.actions.pipe(
    ofType(inventoryActions.updateItemSuccess),
    map((action) => {
      this.commonUiService.notify('Inventory item updated');
    })
  ),
  { dispatch: false }
  );

  updateItemFail = createEffect(() => this.actions.pipe(
    ofType(inventoryActions.updateItemFail),
    map((action) => {
      this.commonUiService.notify('Oops. We are aunable to update the  item.  Please try again');
      return null;
    })  
  ),{ dispatch: false });

  loadItemTransactions = createEffect(() => this.actions.pipe(
    ofType(inventoryActions.loadItemTransactions),
    switchMap(action => {
      this.inventoryTransactionService.setCollection(this.shopid, action.itemdId);
      const result = this.inventoryTransactionService.getTransactions();
      return result.pipe()
    }),

    map( arr => {
      return inventoryActions.loadItemTransactionsSuccess({transactions: arr})
    }),

    catchError((error, caught) => {
      this.store.dispatch(inventoryActions.loadItemTransactionsFail({error}));
      return caught;
    })
  ));
  
  receiveItem = createEffect(() => this.actions.pipe(
    ofType(inventoryActions.receiveItem),
    switchMap(async (action) => {
      const data = <InventoryTransaction>{
        id:'',
        ...action.transaction
      }
      this.inventoryTransactionService.setCollection(this.shopid, action.transaction.itemId);
      const result = await this.inventoryTransactionService.add(data);
      return inventoryActions.receiveItemSuccess({
        transaction: result
      })
    }),
    catchError((error, caught) => {
      this.store.dispatch(inventoryActions.receiveItemFail({error}));
      return caught;
    })  
  ));

  receiveItemSuccess = createEffect(() => this.actions.pipe(
    ofType(inventoryActions.receiveItemSuccess),
    map(async (action) => {
      const balance = await this.inventoryService.incrementBalanceOnHand(action.transaction.itemId, action.transaction.quantityIn)
      this.commonUiService.notify(`Inventory received successfully. New balance ${balance}`);
      return null;
    })
  ),{ dispatch: false });

  updateInventoryBalance = createEffect(() => this.actions.pipe(
    ofType(inventoryActions.updateInventoryBalance),
    mergeMap(async (action) => {
      const data = <InventoryTransaction>{
        id:'',
        ...action.transaction
      }
      this.inventoryTransactionService.setCollection(this.shopid, action.transaction.itemId);
      const result = await this.inventoryTransactionService.add(data);
      return inventoryActions.updateInventoryBalanceSuccess({
        transaction: result
      })
    }),
    catchError((error, caught) => {
      this.store.dispatch(inventoryActions.updateInventoryBalanceFail({error}));
      return caught;
    })  
  ));

  updateInventoryBalanceSuccess = createEffect(() => this.actions.pipe(
    ofType(inventoryActions.updateInventoryBalanceSuccess),
    mergeMap(async (action) => {
      let balance = 0;
      switch(action.transaction.transactionType){
        case InventoryTransactionType.Receipt:
          balance = await this.inventoryService.incrementBalanceOnHand(action.transaction.itemId, action.transaction.quantityIn)
          this.commonUiService.notify(`Inventory received successfully. New balance ${balance}`);    
          break;
        case InventoryTransactionType.Issue:
        case InventoryTransactionType.Sale:
          balance = await this.inventoryService.decrementBalanceOnHand(action.transaction.itemId, action.transaction.quantityOut)
          console.log(`${action.transaction.itemId} Balance decremented by ${action.transaction.quantityOut}`)
          break;
      }
      return null;
    })
  ),{ dispatch: false });


}



