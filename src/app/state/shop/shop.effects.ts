import { Injectable } from '@angular/core';
import { ShopService } from '@app/services/firestore/shop.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { createAction, Store } from '@ngrx/store';
import { catchError, switchMap } from 'rxjs/operators';
import { shopActions } from './shop.actions';
import { AppState } from '@app/state';
import { Shop } from '@app/models/shop';
import { AuthActions } from '../auth/auth.actions';
import { User } from '@app/models/user';
import { shopData } from '@app/data/shop.default';


@Injectable()
export class ShopEffects{
  private uid: string;
  private user: User;
  constructor(
    private store: Store<AppState>,
    private actions: Actions,
    private shopService: ShopService
  ) {
    this.store.select(state => state.auth).subscribe(auth => {
      this.uid = auth.uid;
      this.user = <User>{
        uid: auth.uid,
        displayName: auth.displayName,
        email: auth.email,
        emailVerified: auth.emailVerified,
        photoURL: auth.photoURL,
      }
    });
  }

  

  createStore = createEffect(() => this.actions.pipe(
    ofType(shopActions.createShop),
    switchMap(async (action) => {
      let shop = <Shop>{
        name: action.name,
        description: action.description,
        location: action.location,
        currencyCode: shopData.default.currencyCode,
        paymentTypes: shopData.default.paymentTypes,
        productCategories: shopData.default.productCategories,
        inventoryAdjustmentReasons: shopData.default.inventoryAdjustmentReasons,
        inventoryCategories: shopData.default.inventoryCategories,
        userIds: [this.uid],
        users: [this.user]
      }
      
      shop = await this.shopService.add(shop);

      this.store.dispatch(AuthActions.addShopId({ userId: this.uid, shopId: shop.id}));
      
      return shopActions.createShopSuccess({
        id : shop.id,
        name: shop.name,
        description: shop.description,
        location: shop.location
      })
    }),
    catchError((error, caught) => {
      this.store.dispatch(shopActions.createShopFailed({err: error}));
      return caught;
    })
  ));

  loadShopState = createEffect(() => this.actions.pipe(
    ofType(shopActions.loadShopState),
    switchMap(async (action) => {
      const shop = await this.shopService.get(action.id);
      return shopActions.loadShopStateSuccess({
        id: shop.id,
        name: shop.name,
        description: shop.description,
        location: shop.location 
      })
    }),
    catchError((error,caught)=>{
      this.store.dispatch(shopActions.loadShopStateFail({error}));
      return caught;
    })
  ));

  
}