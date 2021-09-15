import { Injectable } from '@angular/core';
import { InventoryCount } from '@app/models/inventory-count';
import { InventoryItem } from '@app/models/inventory-item';
import { InventoryTransaction } from '@app/models/inventory-transaction';
import { InventoryTransactionType } from '@app/models/types';
import { CommonUIService } from '@app/services/common-ui.service';
import { InventoryCountService } from '@app/services/firestore/inventory-count.service';
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
    private inventoryTransactionService: InventoryTransactionService,
    private inventoryCountService: InventoryCountService
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
        unitCost: 0,
        uom: action.item.uom,
        notes: action.item.notes,
        qtyReceivedToDate: 0,
        costOfQtyReceivedToDate: 0
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

  loadTransactions = createEffect(() => this.actions.pipe(
    ofType(inventoryActions.loadTransactions),
    switchMap(action => {
      const result = this.inventoryTransactionService.getTransactionsByDate(action.fromDate, action.toDate);
      return result.pipe()
    }),

    map( arr => {
      return inventoryActions.loadTransactionsSuccess({transactions: arr})
    }),

    catchError((error, caught) => {
      this.store.dispatch(inventoryActions.loadTransactionsFail({error}));
      return caught;
    })
  ));

  loadItemTransactions = createEffect(() => this.actions.pipe(
    ofType(inventoryActions.loadItemTransactions),
    switchMap(action => {
      //this.inventoryTransactionService.setCollection(this.shopid, action.itemdId);
      const result = this.inventoryTransactionService.getTransactions(action.itemdId);
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
        transactionType: InventoryTransactionType.Receipt,
        itemId: action.itemId,
        itemName: action.itemName,
        transactionOn: new Date(action.receivedOn),
        quantityIn: Number(action.qtyReceived),
        quantityOut: 0,
        reference: action.reference,
        notes: action.notes,
        supplier: action.supplier,
        unitCost: Number(action.unitCost)
      }

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
      await this.inventoryService.updateAverageInventoryCostTotals(action.transaction.itemId, action.transaction.quantityIn, action.transaction.unitCost*action.transaction.quantityIn);
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
      //this.inventoryTransactionService.setCollection(this.shopid, action.transaction.itemId);
      const result = await this.inventoryTransactionService.add(data);

      let balance = 0;
      switch(result.transactionType){
        case InventoryTransactionType.Receipt:
          balance = await this.inventoryService.incrementBalanceOnHand(result.itemId, result.quantityIn)
          this.commonUiService.notify(`Inventory received successfully. New balance ${balance}`);    
          break;
        case InventoryTransactionType.Issue:
        case InventoryTransactionType.Sale:
          balance = await this.inventoryService.decrementBalanceOnHand(result.itemId, result.quantityOut)
          console.log(`${result.itemId} Balance decremented by ${result.quantityOut}`)
          break;
        case InventoryTransactionType.Adjustment:  
        case InventoryTransactionType.CountAdjustment:
          if (result.quantityIn > 0){
            balance = await this.inventoryService.incrementBalanceOnHand(result.itemId, result.quantityIn)
            console.log(`${result.itemId} Balance incremented by ${result.quantityIn}`);
          } else if (result.quantityOut > 0)  {
            balance = await this.inventoryService.decrementBalanceOnHand(result.itemId, result.quantityOut)
            console.log(`${result.itemId} Balance decremented by ${result.quantityOut}`);
          }
          break;
      }

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
      return null;
    })
  ),{ dispatch: false });

  loadCounts = createEffect(() => this.actions.pipe(
    ofType(inventoryActions.loadCounts),
    switchMap(action => {
      const result = this.inventoryCountService.query([{name: 'archivedOn', operator: '!=', value: true}]);
      return result.pipe()
    }),

    map( counts => {
      return inventoryActions.loadCountsSuccess({ counts })
    }),

    catchError((error, caught) => {
      this.store.dispatch(inventoryActions.loadInventoryFail({error}));
      return caught;
    })
  ));

  submitCount = createEffect(() => this.actions.pipe(
    ofType(inventoryActions.submitCount),
    switchMap(async (action) => {
      const data = <InventoryCount>{
        id:'',
        ...action.count
      }
      const result = await this.inventoryCountService.add(data);
      return inventoryActions.submitCountSuccess({
        count: result
      })
    }),
    catchError((error, caught) => {
      this.store.dispatch(inventoryActions.submitCountFail({error}));
      return caught;
    })  
  ));

  submitCountSuccess = createEffect(() => this.actions.pipe(
    ofType(inventoryActions.submitCountSuccess),
    map(async (action) => {
      this.commonUiService.notify(`Inventory count submitted`);
      return null;
    })
  ),{ dispatch: false });

  archiveCount = createEffect(() => this.actions.pipe(
    ofType(inventoryActions.archiveCount),
    switchMap(async (action) => {
      const data = await this.inventoryCountService.get(action.id);
      if (data == null) throw('Record not found');
      data.archivedOn = new Date();
      const item = await this.inventoryCountService.update(data);
      
      return inventoryActions.archiveCountSuccess({
        update: {
          id: item.id,
          changes: { 
            archivedOn : item.archivedOn
          }
        } 
      })
    }),
    catchError((error, caught) => {
      this.store.dispatch(inventoryActions.archiveCountFail({error}));
      return caught;
    })  
  ));

  deleteCount = createEffect(() => this.actions.pipe(
    ofType(inventoryActions.deleteCount),
    switchMap(async (action) => {
      const data = await this.inventoryCountService.get(action.id);
      if (data == null) throw('Record not found')
      await this.inventoryCountService.delete(data);
      return inventoryActions.deleteCountSuccess();
    }),
    catchError((error, caught) => {
      this.store.dispatch(inventoryActions.deleteCountFail({error}));
      return caught;
    })  
  ));

}



