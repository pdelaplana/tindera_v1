import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { InventoryTransaction } from '@app/models/inventory-transaction';
import { AppState } from '@app/state';
import { Store } from '@ngrx/store';
import { RepositoryService } from './repository.service';

@Injectable({
  providedIn: 'root'
})
export class InventoryTransactionService extends RepositoryService<InventoryTransaction>{

  constructor(
    public store: Store<AppState>,
    public firestore: AngularFirestore
  ) {
    super(store,firestore);
    this.store.select(state => state.shop.id).subscribe(
      (shopId) => {
        if (shopId !== '') {
          this.collectionName = `shops/${shopId}/inventoryTransactions`;
        };
      }
    );
  }

  getTransactions(){
    return this.query([]);
  }

  getTransactionsByItem(itemId: string){
    return this.query([{name: 'itemId', operator: '==', value: itemId}]);
  }

  getTransactionsByDate(fromDate: Date, toDate: Date){
    return this.query([
      {name: 'transactionOn', operator: '>=', value: fromDate},
      {name: 'transactionOn', operator: '<=', value: toDate}
    ]);
  }
}
