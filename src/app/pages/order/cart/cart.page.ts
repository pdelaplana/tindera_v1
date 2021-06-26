import { Component, OnInit } from '@angular/core';
import { Product } from '@app/models/product';
import { CommonUIService } from '@app/services/common-ui.service';
import { AppState } from '@app/state';
import { cartActions } from '@app/state/cart/cart.actions';
import { selectCartItems } from '@app/state/cart/cart.selectors';
import { SharePluginWeb } from '@capacitor/core';
import { ModalController, NavController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Cart } from 'src/app/models/cart';
import { CartItem } from 'src/app/models/cart-item';
import { OrderProductPage } from '../order-product/order-product.page';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {

  currencyCode: string;
  cartItems$: Observable<CartItem[]>;

  totalCartAmount: number;

  constructor(
    private store: Store<AppState>,
    private navController: NavController,
    private modalController: ModalController,
    private commonUIService: CommonUIService
  ) { 
    this.store.select(state => state.shop)
      .subscribe((shop) => this.currencyCode = shop.currencyCode)
    this.cartItems$ = this.store.select(selectCartItems());

    this.cartItems$
      .subscribe((items) => {
        this.totalCartAmount = items.map(item => item.amount).reduce((a,b)=> a + b, 0)
      });
  }

  ngOnInit() {
   
  }

  openItemOptions(event, item){
    item.open();
  }

  navigateToCheckout(){
    this.navController.navigateForward('order/checkout');
  }

  clearCart(){
    this.commonUIService.confirmAction('Clear Cart', 'All items in the cart will be removed.').then(result => {
      if (result == 'continue') {
        this.store.dispatch(cartActions.clearCart());
      }
    });
  }

  removeItem(cartItem:CartItem){
    this.commonUIService.confirmAction('Remove Item', 'Remove this item.').then(result => {
      if (result == 'continue') {
        this.store.dispatch(cartActions.removeItemFromCart({cartItem}));
      }
    });
  }

  async modifyItem(product: Product, quantity: number){
    const modal = await this.modalController.create({
      component: OrderProductPage,
      componentProps: {
        product,
        quantity
      }
    });
   
    return await modal.present();
  }


}
