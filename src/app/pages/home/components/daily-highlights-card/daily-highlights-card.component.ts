import { Component, OnInit } from '@angular/core';
import { AppState } from '@app/state';
import { inventoryActions } from '@app/state/inventory/inventory.actions';
import { selectInventoryTransactionsByPeriod } from '@app/state/inventory/inventory.selectors';
import { selectOrdersByPeriod } from '@app/state/orders/order.selectors';
import { ofType } from '@ngrx/effects';
import { ActionsSubject, Store } from '@ngrx/store';
import * as moment from 'moment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-daily-highlights-card',
  templateUrl: './daily-highlights-card.component.html',
  styleUrls: ['./daily-highlights-card.component.scss'],
})
export class DailyHighlightsCardComponent implements OnInit {

  private subscription: Subscription = new Subscription();

  currentDate: Date;
  toDate: Date;
  fromDate: Date
  
  currencyCode: string;
  totalSalesAmount: number;
  totalProductCost: number;


  constructor( 
    private store: Store<AppState>,
    private actions: ActionsSubject,
    ) { }

  ngOnInit() {

    this.subscription
    .add(
      this.actions.pipe(
        ofType(inventoryActions.loadTransactionsSuccess),
      ).subscribe(action =>{
        this.store.select(selectInventoryTransactionsByPeriod(this.fromDate, this.toDate)).subscribe(transactions => {
          this.totalProductCost = transactions.filter(transaction => transaction.transactionType == 'sale')
            .reduce((sum, current) => sum + current.unitCost, 0 )
    
        })
      })
    )
    
    this.currentDate =moment().subtract(1, 'day').toDate()
    this.fromDate = moment(this.currentDate).startOf('day').toDate();
    this.toDate = moment(this.currentDate).endOf('day').toDate();

    this.store.dispatch(inventoryActions.loadTransactions({ fromDate: this.fromDate, toDate: this.toDate }));
    
    this.store.select(selectOrdersByPeriod('today')).subscribe(orders => {
      this.totalSalesAmount = orders.reduce((sum, current) => sum + current.totalSale, 0);
    })

   
  }

}
