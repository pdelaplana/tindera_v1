import { Component, OnInit } from '@angular/core';
import { CartItem } from '@app/models/cart-item';
import { Product } from '@app/models/product';
import { AppState } from '@app/state';
import { cartActions } from '@app/state/cart/cart.actions';
import { productActions } from '@app/state/product/product.actions';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { ProductAddPage } from '../../products/product-add/product-add.page';

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

  constructor(
    private store: Store<AppState>,
    private modalController: ModalController,
  ) { 
    this.store.select(state => state.shop).subscribe(shop => this.currencyCode = shop.currencyCode);

  }

  ngOnInit() {
    this.computeTotal();
  }

  close(){
    this.modalController.dismiss({
      dismissed: true
    });
  }

  computeTotal(){
    this.total = this.product.price * this.quantity;
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
      amount: this.product.price * this.quantity
    }
    this.store.dispatch(cartActions.addToCart({ cartItem }));
    this.close();
  }

}
