import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Product } from '@app/models/product';
import { AppState } from '@app/state';
import { Store } from '@ngrx/store';
import { from, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { InventoryService } from './inventory.service';
import { RepositoryService } from './repository.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends RepositoryService<Product> {

  constructor(
    public store: Store<AppState>,
    public firestore: AngularFirestore,
    public inventoryService: InventoryService
  ){
    super(store, firestore);
    this.store.select(state => state.shop.id).subscribe(
      shopId => this.collectionName = `shops/${shopId}/products`
    );
  }

  async checkAvailability(id: string): Promise<boolean>{
    const product = await this.get(id);
    const productItems =  product.productItems.filter( async (item) => {
      const inventory = await this.inventoryService.get(item.itemId);
      if (inventory.currentCount < 1) return inventory;
    })
    return (productItems.length > 0);
  }
}
