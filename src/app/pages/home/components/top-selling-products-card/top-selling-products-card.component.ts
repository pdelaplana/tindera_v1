import { Component, OnInit } from '@angular/core';
import { Order } from '@app/models/order';
import { OrderItem } from '@app/models/order-item';
import { AppState } from '@app/state';
import { selectOrdersByPeriod } from '@app/state/orders/order.selectors';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-top-selling-products-card',
  templateUrl: './top-selling-products-card.component.html',
  styleUrls: ['./top-selling-products-card.component.scss'],
})
export class TopSellingProductsCardComponent implements OnInit {

  orders$: Observable<Order[]>;

  topSellingProducts: any[] = [];

  filterLabel = 'This week';
  filterPeriod = 'last7Days';

  private getTopSellingProducts(orders: Order[]){
    const items = orders.map(p =>p.orderItems);
    return items
        .reduce((a,b,) => [...a, ...b], [])
        .sort((a: OrderItem, b: OrderItem) => {
          return a.productName > b.productName ? 1 : -1;
        })
        .reduce((groups: { productName: string, totalSale: number, totalQuantity: number,  orderItems: OrderItem[]}[], thisOrderItem: OrderItem) => {
          let thisProductName = thisOrderItem.productName;
          if (thisProductName == null) thisProductName = 'None';
          let found = groups.find(group => group.productName === thisProductName);
          if (found === undefined) {
            found = {productName: thisProductName, totalSale: 0, totalQuantity: 0,  orderItems:[] };
            groups.push(found);
          }
          found.totalSale += Number(thisOrderItem.productUnitPrice) * Number(thisOrderItem.quantity);
          found.totalQuantity += Number(thisOrderItem.quantity);
          found.orderItems.push(thisOrderItem);
          return groups;
        }, [{ productName: '-', totalSale:0, totalQuantity: 0, orderItems:[]}])
        .sort((a,b) => {
          return a.totalQuantity < b.totalQuantity ? 1 : -1;
        })
        .slice(0,5)
  }

  constructor(
    private store: Store<AppState>,
  ) { }

  ngOnInit() {}

  togglePeriodFilter(period: string){
    if (this.filterPeriod == period)
      return 'primary';
    else
      return '';
  }

  filterByPeriod(period: string){
    this.filterPeriod = period;

    switch (period){
      case 'last7Days':
        this.filterLabel = 'This week'
        break;
      case 'thisMonth':
        this.filterLabel = 'This month'
        break;
      case 'last3Months':
        this.filterLabel = 'Last 3 months';
        break;
      case 'last6Months':
        this.filterLabel = 'Last 6 months';
        break;
      case 'thisYear':
        this.filterLabel = 'This year';
        break;
    }

    this.orders$ = this.store.select(selectOrdersByPeriod(period)); 
    
    this.orders$.subscribe(orders => {
      
      this.topSellingProducts = this.getTopSellingProducts(orders);
      
    });
 
  }


}
