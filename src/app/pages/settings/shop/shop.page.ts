import { Component, OnInit } from '@angular/core';
import { CommonUIService } from '@app/services/common-ui.service';
import { AppState } from '@app/state';
import { shopActions } from '@app/state/shop/shop.actions';
import { act, ofType } from '@ngrx/effects';
import { ActionsSubject, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.page.html',
  styleUrls: ['./shop.page.scss'],
})
export class ShopPage implements OnInit {

  private shopId: string;
  subscription: Subscription = new Subscription();

  constructor(
    private store: Store<AppState>,
    private actions: ActionsSubject,
    private commonUIService: CommonUIService,
  ) { 
    this.store.select(state => state.shop).subscribe(shop => this.shopId = shop.id);
  }

  ngOnInit() {
    this.subscription
      .add(
        this.actions.pipe(
          ofType(shopActions.setupShopDataSuccess)
        ).subscribe(action => {
          this.commonUIService.notify('Data has been succesfully reset.');
          this.store.dispatch(shopActions.loadShopState({id:action.shopdId }));
        })
      )
      .add(
        this.actions.pipe(
          ofType(shopActions.setupShopDataFail)
        ).subscribe(action => {
          this.commonUIService.notifyError('Oops. Something went wrong.')
        })
      )
  }

  resetShopData(){
    this.store.dispatch(shopActions.setupShopData({shopdId: this.shopId}));
  }

}
