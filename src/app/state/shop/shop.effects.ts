import { Injectable } from '@angular/core';
import { ShopService } from '@app/services/firestore/shop.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { createAction, Store } from '@ngrx/store';
import { catchError, map, switchMap } from 'rxjs/operators';
import { shopActions } from './shop.actions';
import { AppState } from '@app/state';
import { Shop } from '@app/models/shop';
import { AuthActions } from '../auth/auth.actions';
import { User } from '@app/models/user';
import { AngularFireFunctions } from '@angular/fire/functions';


@Injectable()
export class ShopEffects{
  private uid: string;
  private user: User;
  constructor(
    private store: Store<AppState>,
    private actions: Actions,
    private functions: AngularFireFunctions,
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

  createStoreSuccess = createEffect(() => this.actions.pipe(
    ofType(shopActions.createShopSuccess),
    switchMap( (action) => {

      const setUpShopData  = this.functions.httpsCallable('setupShopData')
      return setUpShopData({id: action.id}).pipe(
        map(result =>{
          return shopActions.setupShopDataSuccess({shopdId: action.id});  
        })
      )
      
    }),
    catchError((error, caught) => {
      this.store.dispatch(shopActions.setupShopDataFail({error}));
      return caught;
    })
  ));

  setupShopData = createEffect(() => this.actions.pipe(
    ofType(shopActions.setupShopData),
    switchMap( (action) => {

      const setUpShopData  = this.functions.httpsCallable('setupShopData')
      return setUpShopData({id: action.shopdId}).pipe(
        map(result =>{
          return shopActions.setupShopDataSuccess({shopdId: action.shopdId});  
        })
      )
      
    }),
    catchError((error, caught) => {
      this.store.dispatch(shopActions.setupShopDataFail({error}));
      return caught;
    })
  ));

  loadShopState = createEffect(() => this.actions.pipe(
    ofType(shopActions.loadShopState),
    switchMap(async (action) => {
      const shop = await this.shopService.get(action.id);
      return shopActions.loadShopStateSuccess({shop})
    }),
    catchError((error,caught)=>{
      this.store.dispatch(shopActions.loadShopStateFail({error}));
      return caught;
    })
  ));

  
}