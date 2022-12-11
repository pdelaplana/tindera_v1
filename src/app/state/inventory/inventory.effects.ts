/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { InventoryCount } from '@app/models/inventory-count';
import { InventoryCountItem } from '@app/models/inventory-count-item';
import { InventoryItem } from '@app/models/inventory-item';
import { InventoryTransaction } from '@app/models/inventory-transaction';
import { InventoryTransactionType } from '@app/models/types';
import { CommonUIService } from '@app/services/common-ui.service';
import { InventoryCountService } from '@app/services/firestore/inventory-count.service';
import { InventoryTransactionService } from '@app/services/firestore/inventory-transaction.service';
import { InventoryService } from '@app/services/firestore/inventory.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, debounceTime, filter, flatMap, map, mergeMap, switchMap,  withLatestFrom } from 'rxjs/operators';
import { AppState } from '..';
import { inventoryActions } from './inventory.actions';
import { selectAllInventory, selectInventoryItem } from './inventory.selectors';

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
    switchMap(() => {
      const result = this.inventoryService.query([]);
      return result.pipe();
    }),

    map( arr => inventoryActions.loadInventorySuccess({items: arr})),

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
      };
      const result = await this.inventoryService.add(data);
      return inventoryActions.createItemSuccess({
        item: result
      });
    }),
    catchError((error, caught) => {
      this.store.dispatch(inventoryActions.createItemFail({error}));
      return caught;
    })
  ));

  createItemSuccess = createEffect(() => this.actions.pipe(
    ofType(inventoryActions.createItemSuccess),
    map(() => {
      this.commonUiService.notify('New inventory item created');
    })
  ), { dispatch: false });

  createItemFail = createEffect(() => this.actions.pipe(
    ofType(inventoryActions.createItemFail),
    map(() => {
      this.commonUiService.notify('Opps. We are unable to create an inventory item.  Please try again');
    })
  ), { dispatch: false });

  updateItem = createEffect(() => this.actions.pipe(
    ofType(inventoryActions.updateItem),
    debounceTime(500),
    switchMap(async (action) => {

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
      };
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
      });

    }),
    catchError((error, caught) => {
      this.store.dispatch(inventoryActions.updateItemFail({error}));
      return caught;
    })

  ));

  updateItemSuccess = createEffect(() => this.actions.pipe(
    ofType(inventoryActions.updateItemSuccess),
    map(() => {
      this.commonUiService.notify('Inventory item updated');
    })
  ),
  { dispatch: false }
  );

  updateItemFail = createEffect(() => this.actions.pipe(
    ofType(inventoryActions.updateItemFail),
    map(() => {
      this.commonUiService.notify('Oops. We are aunable to update the  item.  Please try again');
      return null;
    })
  ),{ dispatch: false });

  loadTransactions = createEffect(() => this.actions.pipe(
    ofType(inventoryActions.loadTransactions),
    mergeMap( () => {
      const result = this.inventoryTransactionService.getTransactions();
      return result.pipe();
    }),

    map( arr => inventoryActions.loadTransactionsSuccess({transactions: arr})),

    catchError((error, caught) => {
      this.store.dispatch(inventoryActions.loadTransactionsFail({error}));
      return caught;
    })
  ));

  loadTransactionsByDate = createEffect(() => this.actions.pipe(
    ofType(inventoryActions.loadTransactionsByDate),
    mergeMap(action => {
      const result = this.inventoryTransactionService.getTransactionsByDate(action.fromDate, action.toDate);
      return result.pipe();
    }),

    map( arr => inventoryActions.loadTransactionsSuccess({transactions: arr})),

    catchError((error, caught) => {
      this.store.dispatch(inventoryActions.loadTransactionsFail({error}));
      return caught;
    })
  ));

  loadItemTransactions = createEffect(() => this.actions.pipe(
    ofType(inventoryActions.loadItemTransactions),
    switchMap(action => {
      //this.inventoryTransactionService.setCollection(this.shopid, action.itemdId);
      const result = this.inventoryTransactionService.getTransactionsByItem(action.itemdId);
      return result.pipe();
    }),

    map( arr => inventoryActions.loadItemTransactionsSuccess({transactions: arr})),

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
      };

      const result = await this.inventoryTransactionService.add(data);
      return inventoryActions.receiveItemSuccess({
        transaction: result
      });
    }),
    catchError((error, caught) => {
      this.store.dispatch(inventoryActions.receiveItemFail({error}));
      return caught;
    })
  ));

  receiveItemSuccess = createEffect(() => this.actions.pipe(
    ofType(inventoryActions.receiveItemSuccess),
    map(async (action) => {
      await this.inventoryService.updateAverageInventoryCostTotals(
        action.transaction.itemId,
        action.transaction.quantityIn,
        action.transaction.unitCost*action.transaction.quantityIn);
      const balance = await this.inventoryService.incrementBalanceOnHand(action.transaction.itemId, action.transaction.quantityIn);
      this.commonUiService.notify(`Inventory received successfully. New balance ${balance}`);
      return null;
    })
  ),{ dispatch: false });

  updateInventoryBalance = createEffect(() => this.actions.pipe(
    ofType(inventoryActions.updateInventoryBalance),
    switchMap((action) =>
      of(action).pipe(
        withLatestFrom(
          this.store.select(selectInventoryItem(action.transaction.itemId))
        ),
        switchMap(async ([action, item]) => {
          const data = <InventoryTransaction>{
            id:'',
            ...action.transaction,
            unitCost: isNaN(item.unitCost) ? 0 :  Number(item.unitCost),
          };
           //this.inventoryTransactionService.setCollection(this.shopid, action.transaction.itemId);
          const result = await  this.inventoryTransactionService.add(data);
          let balance = 0;
          switch(result.transactionType){
            case InventoryTransactionType.Receipt:
              balance = await this.inventoryService.incrementBalanceOnHand(result.itemId, result.quantityIn);
              this.commonUiService.notify(`Inventory received successfully. New balance ${balance}`);
              break;
            case InventoryTransactionType.Issue:
            case InventoryTransactionType.Sale:
              balance = await this.inventoryService.decrementBalanceOnHand(result.itemId, result.quantityOut);
              console.log(`${result.itemId} Balance decremented by ${result.quantityOut}`);
              break;
            case InventoryTransactionType.Adjustment:
            case InventoryTransactionType.CountAdjustment:
              if (result.quantityIn > 0){
                balance = await this.inventoryService.incrementBalanceOnHand(result.itemId, result.quantityIn);
                console.log(`${result.itemId} Balance incremented by ${result.quantityIn}`);
              } else if (result.quantityOut > 0)  {
                balance = await this.inventoryService.decrementBalanceOnHand(result.itemId, result.quantityOut);
                console.log(`${result.itemId} Balance decremented by ${result.quantityOut}`);
              }
              break;
          }

          return inventoryActions.updateInventoryBalanceSuccess({ transaction: result });
        })
      )
    ),
    catchError((error, caught) => {
      this.store.dispatch(inventoryActions.updateInventoryBalanceFail({error}));
      return caught;
    })
  ));

  updateInventoryBalanceSuccess = createEffect(() => this.actions.pipe(
    ofType(inventoryActions.updateInventoryBalanceSuccess),
    mergeMap(async () => null)
  ),{ dispatch: false });

  loadCounts = createEffect(() => this.actions.pipe(
    ofType(inventoryActions.loadCounts),
    switchMap(() => {
      const result = this.inventoryCountService.query([{name: 'archivedOn', operator: '==', value: null}]);
      return result.pipe();
    }),

    map( counts => inventoryActions.loadCountsSuccess({ counts })),

    catchError((error, caught) => {
      this.store.dispatch(inventoryActions.loadInventoryFail({error}));
      return caught;
    })
  ));

  submitCount = createEffect(() => this.actions.pipe(
    ofType(inventoryActions.submitCount),
    switchMap(async (action) => {
      const data = await this.inventoryCountService.get(action.id);
      if (data == null) { throw new Error('Record not found'); }
      data.submittedOn = new Date();
      const item = await this.inventoryCountService.update(data);
      return inventoryActions.submitCountSuccess({
        update: {
          id: item.id,
          changes: {
            submittedOn : item.submittedOn
          }
        }
      });
    }),
    catchError((error, caught) => {
      this.store.dispatch(inventoryActions.submitCountFail({error}));
      return caught;
    })
  ));

  submitCountSuccess = createEffect(() => this.actions.pipe(
    ofType(inventoryActions.submitCountSuccess),
    map(async () => {
      this.commonUiService.notify(`Inventory count submitted`);
      return null;
    })
  ),{ dispatch: false });

  archiveCount = createEffect(() => this.actions.pipe(
    ofType(inventoryActions.archiveCount),
    switchMap(async (action) => {
      const data = await this.inventoryCountService.get(action.id);
      if (data == null) { throw new Error('Record not found'); }
      data.archivedOn = new Date();
      const item = await this.inventoryCountService.update(data);
      return inventoryActions.archiveCountSuccess({
        update: {
          id: item.id,
          changes: {
            archivedOn : item.archivedOn
          }
        }
      });
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
      if (data == null) { throw new Error('Record not found'); };
      await this.inventoryCountService.delete(data);
      return inventoryActions.deleteCountSuccess();
    }),
    catchError((error, caught) => {
      this.store.dispatch(inventoryActions.deleteCountFail({error}));
      return caught;
    })
  ));

  startInventoryCount = createEffect(() => this.actions.pipe(
    ofType(inventoryActions.startInventoryCount),
    switchMap((action) => this.store.select(state => selectAllInventory(state.inventory.items)).pipe(
        map(items => items.map(item =>
          <InventoryCountItem>{
            itemId: item.id,
            itemName: item.name,
            category: item.category.description,
            onHand: item.currentCount,
            counted:0,
            countedOn: null,
            countedBy: null,
            notes:'',
            adjustedOn: null
          })
        ),
        map(items =><InventoryCount>{
            id:'',
            ...action.count,
            countItems: items
          })
      ).pipe()),
    switchMap(async (count) =>{
      const result = await this.inventoryCountService.add(count);
          return inventoryActions.startInventoryCountSuccess({
            count: result
          });
    }),
    catchError((error, caught) => {
      this.store.dispatch(inventoryActions.startInventoryCountFail({error}));
      return caught;
    })
  ));

  updateInventoryCount = createEffect(() => this.actions.pipe(
    ofType(inventoryActions.updateInventoryCount),
    switchMap(async (action) => {
      let count = await this.inventoryCountService.get(action.count.id);
      if (count == null) { throw new Error ('Record not found');}
      count = { ...action.count };
      count = await this.inventoryCountService.update(count);
      return inventoryActions.updateInventoryCountSuccess({
        update: {
          id: count.id,
          changes: count
        }
      });
    }),
    catchError((error, caught) => {
      this.store.dispatch(inventoryActions.updateInventoryCountFail({error}));
      return caught;
    })
  ));

  closeCountItem = createEffect(() => this.actions.pipe(
    ofType(inventoryActions.closeCountItem),
    switchMap(async (action) => {
      let count = await this.inventoryCountService.get(action.countId);
      if (count == null) { throw new Error('Record not found');}

      count = { ...count, countItems: count.countItems.map((item) =>{
        if (item.itemId === action.itemId){
          return {
            ...item,
            adjustedOn: new Date()
          };
        }
        return item;
      })};
      count = await this.inventoryCountService.update(count);

      return inventoryActions.closeCountItemSuccess({
        update: {
          id: count.id,
          changes: count
        }
      });
    }),
    catchError((error, caught) => {
      this.store.dispatch(inventoryActions.closeCountItemFail({error}));
      return caught;
    })
  ));

}



