import { Component, OnInit, ViewChild } from '@angular/core';
import { CartItem } from '@app/models/cart-item';
import { CartItemAddon } from '@app/models/cart-item-addon';
import { Product } from '@app/models/product';
import { ProductAddOn } from '@app/models/product-addon';
import { AppState } from '@app/state';
import { cartActions } from '@app/state/cart/cart.actions';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';


@Component({
  selector: 'app-order-product',
  templateUrl: './order-product.page.html',
  styleUrls: ['./order-product.page.scss'],
})
export class OrderProductPage implements OnInit {
  currencyCode: string
  product: Product;
  quantity: number = 1;

  total: number;

  hideTitle: boolean = true;

  cartItemAddons:CartItemAddon[];

  constructor(
    private store: Store<AppState>,
    private modalController: ModalController,
  ) { 
    this.store.select(state => state.shop).subscribe(shop => this.currencyCode = shop.currencyCode);

  }

  ngOnInit() {
    this.computeTotal();
  }

  onContentScroll(event) {
    if (event.detail.scrollTop == 0) {
      this.hideTitle = true
    } else {
      this.hideTitle = false
    }
  }

  
  get hasProductAddOns() { return this.product.productAddOns && this.product.productAddOns.length > 0; }

  close(){
    this.modalController.dismiss({
      dismissed: true
    });
  }

  incrementAddonQuantity(addon:CartItemAddon){
    addon.quantity++;
    this.computeTotal();
  }

  decrementAddonQuantity(addon:CartItemAddon){
    if (addon.quantity > 0){
      addon.quantity--;
      this.computeTotal();
    } 
  }

  computeTotal(){
    const addonValue = this.cartItemAddons ? this.cartItemAddons.map(a => a.quantity*a.price).reduce((a,b) => a+b, 0) : 0;
    this.total = (this.product.price * this.quantity) + addonValue;
  }

  increment(){
    this.quantity++;
    this.computeTotal();
  }

  decrement(){
    if (this.quantity > 0){
      this.quantity--;
      this.computeTotal();
    }
    
  }

  addToCart(){
    const cartItem = <CartItem>{
      productId: this.product.id,
      product: this.product,
      quantity: this.quantity,
      available: true,
      //amount: (this.product.price * this.quantity) ,
      amount: this.total,
      addons: this.cartItemAddons.filter(i => i.quantity > 0) 
    }
    this.store.dispatch(cartActions.addToCart({ cartItem }));
    this.close();
  }

}
