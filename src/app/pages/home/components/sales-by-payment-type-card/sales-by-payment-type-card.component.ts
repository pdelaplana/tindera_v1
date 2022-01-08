import { Component, OnInit } from '@angular/core';
import { Order } from '@app/models/order';
import { PaymentType } from '@app/models/payment-type';
import { UtilsService } from '@app/services/utils.service';
import { AppState } from '@app/state';
import { selectOrdersByDateRange } from '@app/state/orders/order.selectors';
import { ActionsSubject, Store } from '@ngrx/store';
import {  Subscription } from 'rxjs';
import * as moment from 'moment';
import { orderActions } from '@app/state/orders/order.actions';
import { ofType } from '@ngrx/effects';


@Component({
  selector: 'app-sales-by-payment-type-card',
  templateUrl: './sales-by-payment-type-card.component.html',
  styleUrls: ['./sales-by-payment-type-card.component.scss'],
})
export class SalesByPaymentTypeCardComponent implements OnInit {

  private subscription: Subscription = new Subscription();

  toDate: Date;
  fromDate: Date;

  paymentTypes: PaymentType[];

  salesByPaymentType: any;

  filterLabel = 'Today';
  filterPeriod = 'today';

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
    private actions: ActionsSubject,
    private utils: UtilsService
  ) { }

  ngOnInit() {
    this.store.select(state => state.shop)
      .subscribe((shop) => {
        this.paymentTypes = shop.paymentTypes;
      })

    this.subscription
      .add(
        this.actions.pipe(
          ofType(orderActions.loadOrdersSuccess),
        ).subscribe(action =>{
          this.store.select(selectOrdersByDateRange(this.fromDate, this.toDate)).subscribe(orders => {
            this.salesByPaymentType = this.getSalesByPaymentType(orders);
          })
        })
      )

      this.filterByPeriod('today');
  }

  togglePeriodFilter(period: string){
    if (this.filterPeriod == period)
      return 'primary';
    else
      return '';
  }

  filterByPeriod(period:string){
    this.filterPeriod = period;

    switch (period){
      case 'today':
        this.filterLabel = 'Today'
        break;
      case 'thisWeek':
        this.filterLabel = 'This week'
        break;
      case 'thisMonth':
        this.filterLabel = 'This month'
        break;
      case 'thisQuarter':
        this.filterLabel = 'This quarter'
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

    const [start, end] = this.utils.getDatesfromPeriod(period);
    this.getData(start,end);
 
  }

  getData(fromDate: Date, toDate: Date){
    this.fromDate = moment(fromDate).startOf('day').toDate();
    this.toDate = moment(toDate).endOf('day').toDate();

     // load transactions but ensure shop data is loaded in state store
     this.store.select(state => state.shop).subscribe(shop => {
      if (shop) {
        this.store.dispatch(orderActions.loadOrdersByDate({ fromDate: this.fromDate, toDate: this.toDate }))
      }
    })
   
  }


}
