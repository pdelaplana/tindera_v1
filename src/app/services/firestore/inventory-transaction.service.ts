import { ThrowStmt } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { InventoryItem } from '@app/models/inventory-item';
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
  }

  setCollection(shopId: string, itemId: string){
    this.collectionName = `shops/${shopId}/inventory/${itemId}/transactions`;
  }

  getTransactions(){
    return this.query([]);
  }
}
