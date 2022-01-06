import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppState } from '@app/state';
import { inventoryActions } from '@app/state/inventory/inventory.actions';
import { orderActions } from '@app/state/orders/order.actions';
import { ActionsSubject, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { ofType } from '@ngrx/effects';
import { selectInventoryTransactionsByDateRange } from '@app/state/inventory/inventory.selectors';
import { selectOrdersByDateRange } from '@app/state/orders/order.selectors';
import { UtilsService } from '@app/services/utils.service';

@Component({
  selector: 'app-sales-activity-card',
  templateUrl: './sales-activity-card.component.html',
  styleUrls: ['./sales-activity-card.component.scss'],
})
export class SalesActivityCardComponent implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();

  toDate: Date;
  fromDate: Date;

  currencyCode: string;
  totalOrders: number;
  totalSalesAmount: number;
  totalProductCost: number;
  totalRevenue: number;

  totalSpoilage: number;

  filterLabel = 'Today';
  filterPeriod = 'today';

  
  constructor(
    private store: Store<AppState>,
    private actions: ActionsSubject,
    private utils: UtilsService
  ) { }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
    this.subscription
      .add(
        this.actions.pipe(
          ofType(inventoryActions.loadTransactionsSuccess),
        ).subscribe(action =>{
          this.store.select(selectInventoryTransactionsByDateRange(this.fromDate, this.toDate)).subscribe(transactions => {
            this.totalProductCost = transactions.filter(transaction => transaction.transactionType == 'sale')
              .reduce((sum, current) => sum + current.unitCost, 0 )
            this.totalRevenue = this.totalSalesAmount - this.totalProductCost;

            this.totalSpoilage = transactions
              .filter(transaction => transaction.transactionType == 'adjustment' && transaction.adjustmentReason.code == 'SPOILAGE')
              .reduce((sum, current) => sum + current.unitCost, 0 )

          })            
        })
      )
      .add(
        this.actions.pipe(
          ofType(orderActions.loadOrdersSuccess),
        ).subscribe(action =>{
          this.store.select(selectOrdersByDateRange(this.fromDate, this.toDate)).subscribe(orders => {
            this.totalOrders = orders.length;
            this.totalSalesAmount = orders.reduce((sum, current) => sum + current.totalSale, 0);
            this.totalRevenue = this.totalSalesAmount - this.totalProductCost;
          })
                            
        })
      )

      this.filterPeriod = 'today';
      this.filterByPeriod();

  }

  togglePeriodFilter(period: string){
    if (this.filterPeriod == period)
      return 'primary';
    else
      return '';
  }

  filterByPeriod(){
    const period = this.filterPeriod;

    switch (period){
      case 'yesterday':
        this.filterLabel = 'Yesterday'
        break;
      case 'today':
        this.filterLabel = 'Today'
        break;
      case 'thisWeek':
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

    const [start, end] = this.utils.getDatesfromPeriod(period);
    this.getData(start,end);
 
  }

  getData(fromDate: Date, toDate: Date){
    this.fromDate = moment(fromDate).startOf('day').toDate();
    this.toDate = moment(toDate).endOf('day').toDate();

     // load transactions but ensure shop data is loaded in state store
     this.store.select(state => state.shop).subscribe(shop => {
      if (shop) {
        this.store.dispatch(inventoryActions.loadTransactions({ fromDate: this.fromDate, toDate: this.toDate }));
        this.store.dispatch(orderActions.loadOrdersByDate({ fromDate: this.fromDate, toDate: this.toDate }))
      }
    })
   
  }



}
