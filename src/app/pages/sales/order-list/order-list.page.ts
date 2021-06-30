import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { Order } from '@app/models/order';
import { AppState } from '@app/state';
import { NavController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.page.html',
  styleUrls: ['./order-list.page.scss'],
})
export class OrderListPage implements OnInit {

  orders$: Observable<Order[]>

  constructor(
    private store: Store<AppState>,
    private navController: NavController
  ) { 
   
    this.orders$ = this.store.select(state => 
      Object.entries(state.orders.entities)
      .map(([id,order]) => order)
    )

    this.orders$ = this.orders$.pipe(
      map(data =>{
        data.sort((a,b)=> { return (a.orderDate < b.orderDate) ? 1 : -1 });
        return data;
      })
    )
  }

  ngOnInit() {
  }

  navigateToDetails(orderId: string){
    const navigationExtras: NavigationExtras = { state: { orderId } };
    this.navController.navigateForward('sales/order/details', navigationExtras);
  }


}
