import { Component, OnInit } from '@angular/core';
import { Order } from '@app/models/order';
import { AppState } from '@app/state';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.page.html',
  styleUrls: ['./orders-list.page.scss'],
})
export class OrdersListPage implements OnInit {

  orders$: Observable<Order[]>

  constructor(
    private store: Store<AppState>,
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

}
