import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { AppState } from './state';
import { AuthActions } from './state/auth/auth.actions';
import { AuthState } from './state/auth/auth.state';
import { MenuController, NavController } from '@ionic/angular';
import { ofType } from '@ngrx/effects';
import { inventoryActions } from './state/inventory/inventory.actions';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  
  
  appPages = [
    { title: 'Order', url: '/order', icon: 'cart' },
    { title: 'Sales', url: '/sales', icon: 'cash' },
    { title: 'Products', url: '/products', icon: 'pricetags' },
    { title: 'Inventory', url: '/inventory/balance', icon: 'cube' },
    { title: 'Store', url: '/store/setup', icon: 'business' },
    { title: 'Settings', url: '/folder/Archived', icon: 'cog' },
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
    this.name = store.pipe(select(state => state.auth.displayName));
    this.email = store.select(state => state.auth.email);
    this.isEmailVerified = store.select(state => state.auth.emailVerified);
    this.isAuthenticated = store.select(state => state.auth.isAuthenticated);
  }

  ngOnInit(): void {
    this.store.dispatch(AuthActions.getAuthState());
    this.isAuthenticated.subscribe(value => this.menuController.enable(value));

    this.store.select(state => state.auth).subscribe((auth) =>{
      console.log(auth);
      if (auth.isAuthenticated){
        if (auth.shopIds.length==0){
          
          this.navController.navigateRoot('setup/store');
        } else {
          this.menuController.enable(auth.isAuthenticated);
          this.navController.navigateRoot('order');
        }
      }
    
    });

    this.store.select(state => state.shop.id).subscribe((shopid) => {
      if (shopid){
        this.store.dispatch(inventoryActions.loadInventory({shopid}));  
      }
      
    })

  }
}
