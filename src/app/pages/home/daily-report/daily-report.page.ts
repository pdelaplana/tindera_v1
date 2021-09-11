import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { InventoryTransaction } from '@app/models/inventory-transaction';
import { Order } from '@app/models/order';
import { AppState } from '@app/state';
import { inventoryActions } from '@app/state/inventory/inventory.actions';
import { selectInventoryTransactions, selectInventoryTransactionsByPeriod } from '@app/state/inventory/inventory.selectors';
import { selectOrdersBetweenDates, selectOrdersByPeriod } from '@app/state/orders/order.selectors';
import { NavController } from '@ionic/angular';
import { ofType } from '@ngrx/effects';
import { ActionsSubject, Store } from '@ngrx/store';
import * as moment from 'moment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-daily-report',
  templateUrl: './daily-report.page.html',
  styleUrls: ['./daily-report.page.scss'],
})
export class DailyReportPage implements OnInit {

  private subscription: Subscription = new Subscription();
  
  currentDate: Date;
  toDate: Date;
  fromDate: Date
  orders: Order[];
  totalSales : number;
  totalCashSales: number;
  totalOnlineSales: number;

  transactions:{ itemId: string, itemName: string, quantityIn: number, quantityOut:number }[];

  private groupTransactionsByItem(transactions: InventoryTransaction[]):{ itemId: string, itemName: string, quantityIn: number, quantityOut:number }[] {
    return transactions
      .sort((a: InventoryTransaction, b: InventoryTransaction) => {
        return a.itemId > b.itemId ? 1 : -1;
      })
      .reduce((groups: { itemId: string, itemName: string, quantityIn: number, quantityOut:number }[], thisTransaction : InventoryTransaction) => {
        let thisItemId = thisTransaction.itemId;
        if (thisItemId == null) thisItemId = 'Unknown';
        let found = groups.find(group => group.itemId === thisItemId);
        if (found === undefined) {
          found = {itemId: thisItemId, itemName: thisTransaction.itemName, quantityIn: 0, quantityOut: 0 };
          groups.push(found);
        }
        found.quantityIn += Number(thisTransaction.quantityIn);
        found.quantityOut += Number(thisTransaction.quantityOut);
        return groups;
      }, [])
     
  }

  constructor(
    private store: Store<AppState>,
    private actions: ActionsSubject,
    private navController: NavController
  ) { }

  ngOnInit() {
    
    this.loadData(moment().subtract(1, 'day').toDate());
    this.subscription
      .add(
        this.actions.pipe(
          ofType(inventoryActions.loadTransactionsSuccess),
        ).subscribe(action =>{
          this.store.select(selectInventoryTransactionsByPeriod(this.fromDate, this.toDate)).subscribe(transactions => {
            this.transactions = this.groupTransactionsByItem(transactions);
          })
        })
      )
  }

  loadData(currentDate: Date){
    this.currentDate = currentDate;
    this.fromDate = moment(this.currentDate).startOf('day').toDate();
    this.toDate = moment(this.currentDate).endOf('day').toDate();

    this.store.dispatch(inventoryActions.loadTransactions({ fromDate: this.fromDate, toDate: this.toDate }));
    this.store.select(selectOrdersBetweenDates(this.fromDate, this.toDate)).subscribe(orders => {
      this.orders = orders;
      this.totalSales = orders
        .reduce((sum,current) => sum + Number(current.totalSale), 0 );
      this.totalCashSales = orders
        .filter(orders => orders.paymentType.code == 'CASH')
        .reduce((sum,current) => sum + Number(current.totalSale), 0 );
      this.totalOnlineSales = orders
        .filter(orders => orders.paymentType.code != 'CASH')
        .reduce((sum,current) => sum + Number(current.totalSale), 0 )
    })
  }

  dateChanged(date) {
    this.loadData(date);
  }

  navigateToOrderDetails(orderId: string){
    const navigationExtras: NavigationExtras = { state: { orderId } };
    this.navController.navigateForward('sales/order/details', navigationExtras);
  }

  navigateToInventoryTransactions(itemId: string){
    const navigationExtras: NavigationExtras = { state: { itemId, fromDate: this.fromDate, toDate: this.toDate } };
    this.navController.navigateForward('inventory/transactions', navigationExtras);
  }

}
