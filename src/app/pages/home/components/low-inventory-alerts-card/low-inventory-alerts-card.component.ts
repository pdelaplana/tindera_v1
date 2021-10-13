import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { InventoryItem } from '@app/models/inventory-item';
import { AppState } from '@app/state';
import { selectInventoryForReorder } from '@app/state/inventory/inventory.selectors';
import { NavController } from '@ionic/angular';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-low-inventory-alerts-card',
  templateUrl: './low-inventory-alerts-card.component.html',
  styleUrls: ['./low-inventory-alerts-card.component.scss'],
})
export class LowInventoryAlertsCardComponent implements OnInit {

  itemsForReorder: InventoryItem[];
  
  constructor(
    private store: Store<AppState>,
    private navController: NavController
  ) { }

  ngOnInit() {
    this.store.select(selectInventoryForReorder()).subscribe(items => {
      this.itemsForReorder = items.slice(0,5);
    });
  }

  navigateToLowInventoryAlerts(){
    const navigationExtras: NavigationExtras = { state: {  } };
    this.navController.navigateForward('home/alerts', navigationExtras);
  }

}
