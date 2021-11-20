import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { InventoryCount } from '@app/models/inventory-count';
import { AppState } from '@app/state';
import { selectAllInventoryCounts } from '@app/state/inventory/inventory.selectors';
import { ModalController, NavController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { InventoryCountStartDialogPage } from '../inventory-count-start-dialog/inventory-count-start-dialog.page';

@Component({
  selector: 'app-inventory-count-list',
  templateUrl: './inventory-count-list.page.html',
  styleUrls: ['./inventory-count-list.page.scss'],
})
export class InventoryCountListPage implements OnInit {

  inventoryCounts$: Observable<InventoryCount[]>;

  openCounts: InventoryCount[];
  submittedCounts: InventoryCount[];

  constructor(
    private store: Store<AppState>,
    private navController: NavController,
    private modalController: ModalController,
  ) { }

  ngOnInit() {
    this.store.select(selectAllInventoryCounts()).subscribe(counts =>{
      this.openCounts = counts.filter(count => count.submittedOn == null);
      this.submittedCounts = counts.filter(count => count.submittedOn != null)
    });
  }

  navigateToItemCountDetails(countId: string){
    const navigationExtras: NavigationExtras = { state: { countId } };
    this.navController.navigateForward('inventory/count/details', navigationExtras);
  }

  navigateToItemCountItems(countId: string){
    const navigationExtras: NavigationExtras = { state: { countId } };
    this.navController.navigateForward('inventory/count/items', navigationExtras);
  }

  async openNewInventoryCountDialog(){
    const modal = await this.modalController.create({
      component: InventoryCountStartDialogPage,
      //cssClass: 'small-modal',
      componentProps: {
        //month: moment(this.spendingPeriod).format('M'),
        //year: moment(this.spendingPeriod).format('YYYY')
      }
    });
   
    return await modal.present();
  }


}
