import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { InventoryCount } from '@app/models/inventory-count';
import { AppState } from '@app/state';
import { selectAllInventoryCounts } from '@app/state/inventory/inventory.selectors';
import { NavController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-inventory-count-list',
  templateUrl: './inventory-count-list.page.html',
  styleUrls: ['./inventory-count-list.page.scss'],
})
export class InventoryCountListPage implements OnInit {

  inventoryCounts$: Observable<InventoryCount[]>;

  constructor(
    private store: Store<AppState>,
    private navController: NavController,
  ) { }

  ngOnInit() {
    this.inventoryCounts$ = this.store.select(selectAllInventoryCounts());
  }

  navigateToItemCountDetails(countId: string){
    const navigationExtras: NavigationExtras = { state: { countId } };
    this.navController.navigateForward('inventory/count/details', navigationExtras);
  }

}
