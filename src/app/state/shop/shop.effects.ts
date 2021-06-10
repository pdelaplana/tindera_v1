import { Injectable } from '@angular/core';
import { ShopService } from '@app/services/firestore/shop.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { createAction, Store } from '@ngrx/store';
import { catchError, switchMap } from 'rxjs/operators';
import { ShopActions } from './shop.actions';
import { AppState } from '@app/state';
import { Shop } from '@app/models/shop';
import { AuthActions } from '../auth/auth.actions';


@Injectable()
export class ShopEffects{
  private uid: string;
  constructor(
    private store: Store<AppState>,
    private actions: Actions,
    private shopService: ShopService
  ) {
    this.store.select(state => state.auth.uid).subscribe(uid => this.uid = uid);
  }

  /*
  getShopOfUser = createEffect(() => this.actions.pipe(
    ofType(ShopActions.getShopOfUser),
    //switchMap(),
    //catchError()
  ));
  */

  createStore = createEffect(() => this.actions.pipe(
    ofType(ShopActions.createShop),
    switchMap(async (action) => {
      let shop = <Shop>{
        name: action.name,
        description: action.description,
        location: action.location
      }
      
      shop = await this.shopService.add(shop);

      this.store.dispatch(AuthActions.addShopId({ userId: this.uid, shopId: shop.id}));
      
      return ShopActions.createShopSuccess({
        id : shop.id,
        name: shop.name,
        description: shop.description,
        location: shop.location
      })
    }),
    catchError((error, caught) => {
      this.store.dispatch(ShopActions.createShopFailed({err: error}));
      return caught;
    })
  ));

  loadShopState = createEffect(() => this.actions.pipe(
    ofType(ShopActions.loadShopState),
    switchMap(async (action) => {
      const shop = await this.shopService.get(action.id);
      return ShopActions.loadShopStateSuccess({
        id: shop.id,
        name: shop.name,
        description: shop.description,
        location: shop.location 
      })
    }),
    catchError((error,caught)=>{
      this.store.dispatch(ShopActions.loadShopStateFail({error}));
      return caught;
    })
  ));

  
}