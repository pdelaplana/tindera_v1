import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { InventoryTransaction } from '@app/models/inventory-transaction';
import { AppState } from '@app/state';
import { inventoryActions } from '@app/state/inventory/inventory.actions';
import { selectInventoryItemTransactions } from '@app/state/inventory/inventory.selectors';
import { NavController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-inventory-item-transactions',
  templateUrl: './inventory-item-transactions.page.html',
  styleUrls: ['./inventory-item-transactions.page.scss'],
})
export class InventoryItemTransactionsPage implements OnInit {

  private itemId : string;
  private fromDate: Date;
  private toDate: Date;
  transactions$: Observable<InventoryTransaction[]>;
  transactions: InventoryTransaction[];

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private navController: NavController
  ) { 
    if (this.router.getCurrentNavigation().extras.state) {
      this.itemId = this.router.getCurrentNavigation().extras.state.itemId;
      this.fromDate = this.router.getCurrentNavigation().extras.state.fromDate;
      this.toDate = this.router.getCurrentNavigation().extras.state.toDate;
    } 
    this.transactions$ = this.store.select(selectInventoryItemTransactions(this.itemId, this.fromDate, this.toDate));
    
    this.transactions$ = this.transactions$.pipe(
      map(data =>{
        data.sort((a,b)=> { return (a.transactionOn < b.transactionOn) ? 1 : -1 });
        return data;
      })
    )
  }

  ngOnInit() {
    this.store.dispatch(inventoryActions.loadItemTransactions({ itemdId: this.itemId}));
  }

  navigateToItemTransactionDetails(transactionId: string){
    const navigationExtras: NavigationExtras = { state: { transactionId } };
    this.navController.navigateForward('inventory/transaction/details', navigationExtras);
  }

}
