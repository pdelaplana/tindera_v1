import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { AppState } from '@app/state';
import { selectAllAndGroupInventory } from '@app/state/inventory/inventory.selectors';
import { ModalController, NavController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AddInventoryItemPage } from '../add-inventory-item/add-inventory-item.page';

@Component({
  selector: 'app-inventory-balance',
  templateUrl: './inventory-balance.page.html',
  styleUrls: ['./inventory-balance.page.scss'],
})
export class InventoryBalancePage implements OnInit {

  inventoryItems$: Observable<any>

  constructor(
    private store: Store<AppState>,
    private modalController: ModalController,
    private navController: NavController
  ) { 
    
  }

  ngOnInit() {
    this.inventoryItems$ = this.store.select(selectAllAndGroupInventory(null));
     
  }

  searchFor(event: any){
    const queryTerm = event.srcElement.value;
    this.inventoryItems$ = this.store.select(selectAllAndGroupInventory(queryTerm));
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
