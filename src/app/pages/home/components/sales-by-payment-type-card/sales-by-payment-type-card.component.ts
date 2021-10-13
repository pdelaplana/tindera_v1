import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Order } from '@app/models/order';
import { PaymentType } from '@app/models/payment-type';
import { AppState } from '@app/state';
import { selectOrdersByPeriod } from '@app/state/orders/order.selectors';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sales-by-payment-type-card',
  templateUrl: './sales-by-payment-type-card.component.html',
  styleUrls: ['./sales-by-payment-type-card.component.scss'],
})
export class SalesByPaymentTypeCardComponent implements OnInit {

  currencyCode: string;
  paymentTypes: PaymentType[];

  orders$: Observable<Order[]>;

  salesByPaymentType: any;

  filterLabel = 'This week';
  filterPeriod = 'last7Days';

  private getSalesByPaymentType(orders:Order[]): { paymentType: string,  totalSale: number, orders: Order[]}[] {
    const paymentTypes = [];
    this.paymentTypes.forEach(paymentType => 
      paymentTypes.push({ code: paymentType.code, description: paymentType.description, totalSale: 0 }));

    orders
      .sort((a: Order, b: Order) => {
        return a.paymentType?.code > b.paymentType?.code ? 1 : -1;
      })
      .forEach(order =>{
        let found = paymentTypes.find(paymentType => paymentType.description == order.paymentType.description);
        if (found){
          found.totalSale += Number(order.totalSale);
        }
      })
      return paymentTypes;
  }
  
  constructor(
    private store: Store<AppState>,
    private currencyPipe: CurrencyPipe,
  ) { }

  ngOnInit() {
    this.store.select(state => state.shop)
      .subscribe((shop) => {
        this.currencyCode = shop.currencyCode;
        this.paymentTypes = shop.paymentTypes;
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
      this.salesByPaymentType = this.getSalesByPaymentType(orders);
      
    });
 
  }


}
