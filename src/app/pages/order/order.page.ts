import { Component, OnInit } from '@angular/core';
import { CartItemAddon } from '@app/models/cart-item-addon';
import { Product } from '@app/models/product';
import { CommonUIService } from '@app/services/common-ui.service';
import { AppState } from '@app/state';
import { selectCartItems } from '@app/state/cart/cart.selectors';
import { productActions } from '@app/state/product/product.actions';
import { selectAllProducts, selectProductState } from '@app/state/product/product.selectors';
import { ModalController, NavController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MenuItem } from 'src/app/models/menu-item';
import { OrderProductPage } from './order-product/order-product.page';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit {

  private shopid: string;

  products$ : Observable<Product[]>;
  
  totalCartAmount: number = 0.00;

  currencyCode : string = 'P';

  constructor(
    private store: Store<AppState>,
    private modalController: ModalController,
    private navController: NavController,
    private commonUIService: CommonUIService
  ) { 
    this.store.select(state =>state.shop)
      .subscribe((shop) => {
        this.shopid = shop.id;
        this.currencyCode = shop.currencyCode;
      });
    this.store.select(selectCartItems())
      .subscribe((items) => {
        this.totalCartAmount = items.map(item => item.amount).reduce((a,b)=> a + b, 0) 
      });

    this.products$ = this.store.select(selectAllProducts());
  }

  ngOnInit() {
    
  }

  async orderProduct(product: Product){
    const modal = await this.modalController.create({
      component: OrderProductPage,
      //cssClass: 'small-modal',
      componentProps: {
        product,
        cartItemAddons: product.productAddOns 
          ? product.productAddOns.map(a => <CartItemAddon>{ 
            itemId: a.itemId,
            name: a.name,
            price: a.price,
            quantity: 0
          }) : []
      }
    });
    return await modal.present();
  }

  navigateToCart(){
    this.navController.navigateForward('order/cart');
  }

  navigateToItem(){
    this.navController.navigateForward('item');
  }

}
