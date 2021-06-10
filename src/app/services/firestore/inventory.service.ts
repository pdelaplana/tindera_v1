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
export class InventoryService extends RepositoryService<InventoryItem> {
  constructor(
    public store: Store<AppState>,
    public firestore: AngularFirestore
  ){
    super(store, firestore);
    this.store.select(state => state.shop.id).subscribe(
      shopId => this.collectionName = `shops/${shopId}/inventory`
    );
  }

  async incrementBalanceOnHand(itemId: string, quantityIn: number){
    const item = await this.get(itemId);
    item.currentCount = Number(item.currentCount)+quantityIn;
    await this.update(item);
    return item.currentCount;
  }

  async decrementBalanceOnHand(itemId: string, quantityOut: number){
    const item = await this.get(itemId);
    item.currentCount = Number(item.currentCount)-quantityOut;
    await this.update(item);
    return item.currentCount;
  }

  
}
