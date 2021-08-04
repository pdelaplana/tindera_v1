import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { InventoryCount } from '@app/models/inventory-count';
import { AppState } from '@app/state';
import { Store } from '@ngrx/store';
import { RepositoryService } from './repository.service';

@Injectable({
  providedIn: 'root'
})
export class InventoryCountService extends RepositoryService<InventoryCount>{

  constructor(
    public store: Store<AppState>,
    public firestore: AngularFirestore
  ) { 
    super(store,firestore);
    this.store.select(state => state.shop.id).subscribe(
      shopId => this.collectionName = `shops/${shopId}/counts`
    );
  }

}
