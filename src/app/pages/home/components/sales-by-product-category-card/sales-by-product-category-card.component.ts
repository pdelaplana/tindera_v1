import { Component, OnInit } from '@angular/core';
import { Order } from '@app/models/order';
import { OrderItem } from '@app/models/order-item';
import { ProductCategory } from '@app/models/product-category';
import { AppState } from '@app/state';
import { selectOrdersByPeriod } from '@app/state/orders/order.selectors';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sales-by-product-category-card',
  templateUrl: './sales-by-product-category-card.component.html',
  styleUrls: ['./sales-by-product-category-card.component.scss'],
})
export class SalesByProductCategoryCardComponent implements OnInit {
  
  currencyCode: string;
  productCategories: ProductCategory[];

  orders$: Observable<Order[]>;

  salesByProductCategory: any;

  filterLabel = 'This week';
  filterPeriod = 'last7Days';

  private getSaleByProductCategory(orders: Order[]){
    const items = orders.map(p =>p.orderItems);
    return items
        .reduce((a,b,) => [...a, ...b], [])
        .sort((a: OrderItem, b: OrderItem) => {
          return a.productCategory > b.productCategory ? 1 : -1;
        })
        .reduce((groups: { productCategory: string, totalSale: number, totalQuantity: number,  orderItems: OrderItem[]}[], thisOrderItem: OrderItem) => {
          let thisProductCategory = thisOrderItem.productCategory;
          if (thisProductCategory == null) thisProductCategory = 'None';
          let found = groups.find(group => group.productCategory === thisProductCategory);
          if (found === undefined) {
            found = {productCategory: thisProductCategory, totalSale: 0, totalQuantity: 0,  orderItems:[] };
            groups.push(found);
          }
          found.totalSale += Number(thisOrderItem.productUnitPrice) * Number(thisOrderItem.quantity);
          found.totalQuantity += Number(thisOrderItem.quantity);
          found.orderItems.push(thisOrderItem);
          return groups;
        }, [])
        .slice(0,4)
  }


  
  constructor(
    private store: Store<AppState>,
  ) { }

  ngOnInit() {
    this.store.select(state => state.shop)
      .subscribe((shop) => {
        this.currencyCode = shop.currencyCode;
        this.productCategories = shop.productCategories;
      })
  }

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
      this.salesByProductCategory = this.getSaleByProductCategory(orders);
    });
 
  }


}
