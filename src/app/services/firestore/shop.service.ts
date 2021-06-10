import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, CollectionReference } from '@angular/fire/firestore';
import { Shop } from '@app/models/shop';
import { AppState } from '@app/state';
import { Store } from '@ngrx/store';
import { RepositoryService } from './repository.service';

@Injectable({
  providedIn: 'root'
})
export class ShopService  {

  private collectionName = 'shops'
  private collection: AngularFirestoreCollection;

  private uid: string;

  constructor(
    private store: Store<AppState>,
    private firestore: AngularFirestore
  ) { 
    this.collection = this.firestore.collection<Shop>('shops');
    this.store.select(state => state.auth.uid).subscribe((uid) => this.uid = uid);
  }

  async get(id: string){
    const snapshot = this.firestore.collection('shops').doc(id);
    const data = await (await snapshot.get().toPromise()).data() as Shop
    return <Shop>{
      id: snapshot.ref.id,
      ...data
    }
  }

  async add(shop:Shop):Promise<Shop> {

    const audit =  {
      createdByUid : this.uid,
      createdDate : new Date(),
      lastUpdatedByUid : this.uid,
      lastUpdatedDate : new Date()
    } 
    const { id, ...rest } = shop;
    const data = { ...rest, audit }

    const reference = await this.firestore.collection('shops').add(data);
    //const document = (await reference.get()).data() as Shop;

    return <Shop>{
      id : reference.id,
      ...(await reference.get()).data() as Shop
    }
  }

  update(id: string, shop:Shop) {
 
    return this.firestore.collection('shops').doc(id).set(shop);
  }
    

}
