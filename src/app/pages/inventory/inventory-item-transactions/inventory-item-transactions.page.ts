import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InventoryTransaction } from '@app/models/inventory-transaction';
import { AppState } from '@app/state';
import { inventoryActions } from '@app/state/inventory/inventory.actions';
import { selectInventoryTransactions, selectItemTransactions } from '@app/state/inventory/inventory.selectors';
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
  transactions$: Observable<InventoryTransaction[]>;
  transactions: InventoryTransaction[];

  constructor(
    private store: Store<AppState>,
    private router: Router
    
  ) { 
    if (this.router.getCurrentNavigation().extras.state) {
      this.itemId = this.router.getCurrentNavigation().extras.state.itemId;
    } 
    //this.transactions$ = this.store.select(selectItemTransactions(this.itemId));
    
    this.transactions$ = this.store.select(state => 
      Object.entries(state.inventory.transactions.entities)
        .filter(([id,transaction])=>transaction.itemId == this.itemId)
        .map(([id,transaction]) => transaction)
    )
    
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

}
