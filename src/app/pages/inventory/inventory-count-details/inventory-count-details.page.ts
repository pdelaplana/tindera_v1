import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { InventoryCount } from '@app/models/inventory-count';
import { InventoryCountItem } from '@app/models/inventory-count-item';
import { CommonUIService } from '@app/services/common-ui.service';
import { AppState } from '@app/state';
import { inventoryActions } from '@app/state/inventory/inventory.actions';
import { selectInventoryCount } from '@app/state/inventory/inventory.selectors';
import { ActionSheetController, NavController } from '@ionic/angular';
import { ofType } from '@ngrx/effects';
import { ActionsSubject, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-inventory-count-details',
  templateUrl: './inventory-count-details.page.html',
  styleUrls: ['./inventory-count-details.page.scss'],
})
export class InventoryCountDetailsPage implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();
  count: InventoryCount;
  items: InventoryCountItem[];
  
  constructor(
    private store: Store<AppState>,
    private actions: ActionsSubject,
    private router: Router,
    private navController: NavController,
    private commonUIService: CommonUIService,
    public actionSheetController: ActionSheetController,
  ) { 
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
    if (this.router.getCurrentNavigation().extras.state) {
      const countId = this.router.getCurrentNavigation().extras.state.countId;
      this.store.select(selectInventoryCount(countId)).subscribe(count => {
        this.count = count
        this.items = count.countItems.filter(item => item.counted != item.onHand);
      });
    }

    this.subscription
      .add(
        this.actions.pipe(
          ofType(inventoryActions.archiveCountSuccess)
        ).subscribe(action =>{
          this.store.dispatch(inventoryActions.clearInventoryActions());
          this.navController.navigateRoot('inventory/counts');
        })
      )
      .add(
        this.actions.pipe(
          ofType(inventoryActions.deleteCountSuccess)
        ).subscribe(action =>{
          this.store.dispatch(inventoryActions.clearInventoryActions());
          this.navController.navigateRoot('inventory/counts');
        })
      )
  }

  async presentActionSheet() {
    
    const buttons = new Array();
    buttons.push({
      text: 'Cancel',
      icon: 'close',
      role: 'cancel',
      handler: () => {
   
      }
    });
    buttons.push({
      text: 'Archive',
      icon: 'save',
      handler: () =>{
        this.archive();
      }
    }),
    buttons.push({
      text: 'Delete',
      icon: 'trash',
      handler: () => {
        this.delete();
      }
    });
    
    const actionSheet = await this.actionSheetController.create({
      header: 'Options',
      //cssClass: 'my-custom-class',
      buttons: buttons
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
    
  }


  navigateToItemCountAdjustment(countId: string, item: InventoryCountItem){
    if (item.adjustedOn == null){
      const navigationExtras: NavigationExtras = { state: { countId, itemId: item.itemId } };
      this.navController.navigateForward('inventory/count/adjustment', navigationExtras);
    }
    else {
      this.commonUIService.notify('This item has been already adjusted');
    }
  }

  delete(){
    this.commonUIService.confirmAction('Delete Count', 'Continue and delete count?').then(result => {
      if (result == 'continue') {
         this.store.dispatch(inventoryActions.deleteCount({id: this.count.id}));
      }
    });
  }

  archive(){
    this.commonUIService.confirmAction('Archive Count', 'Continue and archve count?').then(result => {
      if (result == 'continue') {
         this.store.dispatch(inventoryActions.archiveCount({id: this.count.id}));
      }
    });
  }


}
