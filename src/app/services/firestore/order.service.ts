import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Order } from '@app/models/order';
import { AppState } from '@app/state';
import { Store } from '@ngrx/store';
import { RepositoryService } from './repository.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService extends RepositoryService<Order> {

  constructor(
    public store: Store<AppState>,
    public firestore: AngularFirestore
  ){
    super(store, firestore);
    this.store.select(state => state.shop.id).subscribe(
      shopId => this.collectionName = `shops/${shopId}/orders`
    );
  }

  getOrdersByDate(fromDate: Date, toDate: Date){
    return this.query([
      {name: 'orderDate', operator: '>=', value: fromDate}, 
      {name: 'orderDate', operator: '<=', value: toDate}
    ]);
  }
}
