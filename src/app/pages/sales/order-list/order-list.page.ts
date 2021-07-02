import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { Order } from '@app/models/order';
import { AppState } from '@app/state';
import { selectAllOrders, selectOrdersByPeriod } from '@app/state/orders/order.selectors';
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

  filter: string; 
  orders$: Observable<Order[]>

  filterBy(period: string){
    this.filter = period;
    if (period == 'all'){
      this.orders$ = this.store.select(selectAllOrders());
    } else {
      this.orders$ = this.store.select(selectOrdersByPeriod(period));
    }
  }

  toggleFilters(period: string){
    if (this.filter == period)
      return 'primary';
    else
      return '';
   
  }


  constructor(
    private store: Store<AppState>,
    private navController: NavController
  ) { 
    this.filterBy('today');
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
