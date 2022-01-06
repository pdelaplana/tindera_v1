import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { AppState } from './state';
import { AuthActions } from './state/auth/auth.actions';
import { MenuController, NavController } from '@ionic/angular';
import { inventoryActions } from './state/inventory/inventory.actions';
import { shopActions } from './state/shop/shop.actions';
import { productActions } from './state/product/product.actions';
import { orderActions } from './state/orders/order.actions';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  
  
  appPages = [
    { title: 'Overview', url: '/home', icon: 'home' },
    { title: 'Order', url: '/order', icon: 'fast-food' },
    { title: 'Sales', url: '/sales/orders', icon: 'cash' },
    { title: 'Products', url: '/products/list', icon: 'pricetags' },
    { title: 'Inventory', url: '/inventory/balance', icon: 'cube' },
    { title: 'Settings', url: '/settings', icon: 'cog' },
    { title: 'Log Out', url: 'logout', icon: 'log-out' },
  ];

  name: Observable<string>;
  email: Observable<string>;
  isEmailVerified: Observable<boolean>;
  
  isAuthenticated: Observable<boolean>;
  actions: any;
  
  constructor(
    private store: Store<AppState>,
    private menuController: MenuController,
    private navController: NavController
  ) {
    
  }

  ngOnInit(): void {
    this.name = this.store.pipe(select(state => state.auth.displayName));
    this.email = this.store.select(state => state.auth.email);
    this.isEmailVerified = this.store.select(state => state.auth.emailVerified);
    this.isAuthenticated = this.store.select(state => state.auth.isAuthenticated);
    this.store.select(state => state.auth).subscribe((auth) =>{
      if (auth.isAuthenticated){
        if (auth.shopIds.length==0){
          this.navController.navigateRoot('store/setup');
        } else {
          this.store.dispatch(shopActions.loadShopState({ id: auth.shopIds[0] }));
          this.menuController.enable(auth.isAuthenticated);
          this.navController.navigateRoot('home');
        }
      }
    });

    this.store.select(state => state.shop.id).subscribe((shopid) => {
      if (shopid){
        this.store.dispatch(inventoryActions.loadInventory({shopid}));  
        this.store.dispatch(productActions.loadProducts({ shopid }));
        //this.store.dispatch(orderActions.loadOrders({ shopid }));
        this.store.dispatch(inventoryActions.loadCounts({ shopid })); 
      }
      
    })
    
    
    this.store.dispatch(AuthActions.getAuthState());
    
    

  }
}
