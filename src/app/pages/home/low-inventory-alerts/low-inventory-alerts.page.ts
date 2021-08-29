import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { InventoryItem } from '@app/models/inventory-item';
import { AppState } from '@app/state';
import { selectInventoryForReorder } from '@app/state/inventory/inventory.selectors';
import { NavController } from '@ionic/angular';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-low-inventory-alerts',
  templateUrl: './low-inventory-alerts.page.html',
  styleUrls: ['./low-inventory-alerts.page.scss'],
})
export class LowInventoryAlertsPage implements OnInit {

  items: InventoryItem[];

  constructor(
    private store: Store<AppState>,
    private navController: NavController
  ) { }

  ngOnInit() {
    this.store.select(selectInventoryForReorder()).subscribe(items => {
      this.items = items;
    });
    
  }

  navigateToDetails(itemId: string){
    const navigationExtras: NavigationExtras = { state: { itemId: itemId } };
    this.navController.navigateForward('inventory/details', navigationExtras);
  }


}
