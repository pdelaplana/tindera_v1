import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InventoryTransaction } from '@app/models/inventory-transaction';
import { AppState } from '@app/state';
import { selectInventoryTransaction } from '@app/state/inventory/inventory.selectors';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-inventory-item-transaction-details',
  templateUrl: './inventory-item-transaction-details.page.html',
  styleUrls: ['./inventory-item-transaction-details.page.scss'],
})
export class InventoryItemTransactionDetailsPage implements OnInit {

  transactionId: string;
  transaction: InventoryTransaction;

  constructor(
    private store: Store<AppState>,
    private router: Router
    
  ) { 
    if (this.router.getCurrentNavigation().extras.state) {
      this.transactionId = this.router.getCurrentNavigation().extras.state.transactionId;
      
      this.store.select(selectInventoryTransaction(this.transactionId)).subscribe(transaction => {
        this.transaction = transaction;
      });
    }
  }

  ngOnInit() {
  }

}
