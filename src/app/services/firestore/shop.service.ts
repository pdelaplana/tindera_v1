import { ThrowStmt } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, CollectionReference } from '@angular/fire/firestore';
import { Shop } from '@app/models/shop';
import { AppState } from '@app/state';
import { ShopEffects } from '@app/state/shop/shop.effects';
import { Store } from '@ngrx/store';
import { RepositoryService } from './repository.service';

@Injectable({
  providedIn: 'root'
})
export class ShopService extends RepositoryService<Shop>  {

  constructor(
    public store: Store<AppState>,
    public firestore: AngularFirestore
  ) { 
    super(store, firestore);
    this.collectionName = 'shops';
  }

  getShopsForUser(uid: string){
    return this.query([{name: 'userIds', operator: 'array-contains', value: uid}]);
  }
    

}
