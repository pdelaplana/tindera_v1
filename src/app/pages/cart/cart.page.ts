import { Component, OnInit } from '@angular/core';
import { Cart } from 'src/app/models/cart';
import { CartItem } from 'src/app/models/cart-item';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {

  cart: Cart = <Cart>{ items: [], total: 200 };

  constructor() { }

  ngOnInit() {
    this.cart.items = [
      <CartItem>{ 
        productName: 'Chili Cheese Tempura',
        amount: 3.56,
        quantity: 2
      },
      <CartItem>{ 
        productName: 'Imperial Mix',
        amount: 3.56,
        quantity: 2
      },
      <CartItem>{ 
        productName: 'Imperial Mix',
        amount: 3.56,
        quantity: 10
      },
    ];
  }

  openItemOptions(event, item){
    item.open();
  }

}
