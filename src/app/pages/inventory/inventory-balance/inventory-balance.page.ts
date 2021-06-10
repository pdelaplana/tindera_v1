import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { InventoryItem } from '@app/models/inventory-item';
import { AppState } from '@app/state';
import { inventoryActions } from '@app/state/inventory/inventory.actions';
import { selectAllInventory } from '@app/state/inventory/inventory.selectors';
import { InventoryState } from '@app/state/inventory/inventory.state';
import { ModalController, NavController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AddInventoryItemPage } from '../add-inventory-item/add-inventory-item.page';

@Component({
  selector: 'app-inventory-balance',
  templateUrl: './inventory-balance.page.html',
  styleUrls: ['./inventory-balance.page.scss'],
})
export class InventoryBalancePage implements OnInit {

  inventoryItems$: Observable<InventoryItem[]>

  constructor(
    private store: Store<AppState>,
    private modalController: ModalController,
    private navController: NavController
  ) { 
    
   
  }

  ngOnInit() {
    this.inventoryItems$ = this.store.select(state => selectAllInventory(state.inventory.items));

    this.inventoryItems$ = this.inventoryItems$.pipe(
      map(data =>{
        data.sort((a,b)=> { return (a.name > b.name) ? 1 : -1 });
        return data;
      })  
    );
    
  }

  async addNewItem(){
    const modal = await this.modalController.create({
      component: AddInventoryItemPage,
      //cssClass: 'small-modal',
      componentProps: {
        //month: moment(this.spendingPeriod).format('M'),
        //year: moment(this.spendingPeriod).format('YYYY')
      }
    });
   
    return await modal.present();
  }

  navigateToDetails(itemId: string){
    const navigationExtras: NavigationExtras = { state: { itemId: itemId } };
    this.navController.navigateForward('inventory/details', navigationExtras);
  }


}
