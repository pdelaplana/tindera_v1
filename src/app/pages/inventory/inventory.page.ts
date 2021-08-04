import { Component, OnInit } from '@angular/core';
import { AppState } from '@app/state';
import { selectAllInventoryCounts } from '@app/state/inventory/inventory.selectors';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
})
export class InventoryPage implements OnInit {

  openInventoryCounts: number;
  
  constructor(
    private store: Store<AppState>
  ) { 
    this.store.select(selectAllInventoryCounts()).subscribe(counts => {
      this.openInventoryCounts = counts.length;
    });
  }

  ngOnInit() {
  }

}
