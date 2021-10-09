import { Injectable } from '@angular/core';
import { CartItem } from '@app/models/cart-item';
import { CommonUIService } from '@app/services/common-ui.service';
import { InventoryService } from '@app/services/firestore/inventory.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { AppState } from '..';
import { selectInventoryItem } from '../inventory/inventory.selectors';
import { cartActions } from './cart.actions';

@Injectable()
export class CartEffects{
  constructor(
    private store: Store<AppState>,
    private actions: Actions
  ) {
   
  }

  addItemToCart = createEffect(() => this.actions.pipe(
    ofType(cartActions.addToCart),
    switchMap(async (action) =>{
      let isProductAvailable = true;
      const quantityOrdered = action.cartItem.quantity;
      action.cartItem.product.productItems.forEach(productItem => {
        this.store.select(selectInventoryItem(productItem.itemId)).subscribe(
          inventory => { 
            isProductAvailable = isProductAvailable && (inventory.currentCount > (productItem.quantity * quantityOrdered))
          }
        )
      })
      const cartItem =<CartItem>{
        productId: action.cartItem.productId,
        product: action.cartItem.product,
        addons: action.cartItem.addons,
        amount: action.cartItem.amount,
        available: isProductAvailable,
        quantity: action.cartItem.quantity
      };
      this.store.dispatch(cartActions.addToCartSuccess({ cartItem }));
    }),
    catchError((error, caught) => {
      this.store.dispatch(cartActions.addToCartFail({error}));
      return caught;
    })
  ),{dispatch: false});

  checkoutCartItems = createEffect(() => this.actions.pipe(
    ofType(cartActions.checkoutCartItems),
    switchMap(async (action) => {
      return cartActions.checkoutCartItemsSuccess();
    }),
    catchError((error, caught) => {
      this.store.dispatch(cartActions.checkoutCartItemsFail({error}));
      return caught;
    })
  ));

}