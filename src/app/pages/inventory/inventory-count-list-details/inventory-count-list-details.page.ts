import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { InventoryCount } from '@app/models/inventory-count';
import { InventoryItem } from '@app/models/inventory-item';
import { InventoryTransaction } from '@app/models/inventory-transaction';
import { InventoryTransactionType } from '@app/models/types';
import { CommonUIService } from '@app/services/common-ui.service';
import { AppState } from '@app/state';
import { inventoryActions } from '@app/state/inventory/inventory.actions';
import { selectInventoryCount, selectInventoryItem } from '@app/state/inventory/inventory.selectors';
import { ActionSheetController, NavController } from '@ionic/angular';
import { ofType } from '@ngrx/effects';
import { ActionsSubject, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-inventory-count-list-details',
  templateUrl: './inventory-count-list-details.page.html',
  styleUrls: ['./inventory-count-list-details.page.scss'],
})
export class InventoryCountListDetailsPage implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();
  
  diff: number;
  count: InventoryCount;
  item: InventoryItem;
  inventoryCountForm: FormGroup;
  
  constructor(
    private store: Store<AppState>,
    private actions: ActionsSubject,
    private router: Router,
    public actionSheetController: ActionSheetController,
    private navController: NavController,
    private commonUIService: CommonUIService
  ) { 
    if (this.router.getCurrentNavigation().extras.state) {
      const countId = this.router.getCurrentNavigation().extras.state.countId;
      this.store.select(selectInventoryCount(countId)).subscribe(count => {
        this.count = count
        this.store.select(selectInventoryItem(count.itemId)).subscribe(item => {
          this.item = item;
          this.diff = this.count.count - this.item.currentCount;
        });

      });
    }

    this.subscription
      .add(
        this.actions.pipe(
          ofType(inventoryActions.updateInventoryBalanceSuccess),
        ).subscribe(action =>{
          this.commonUIService.notify(`Balance for ${this.item.name} has been adjusted.  The new balance for this item ${this.item.currentCount + this.diff}`);
          this.store.dispatch(inventoryActions.deleteCount({ id: this.count.id }));
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
      .add(
        this.actions.pipe(
          ofType(inventoryActions.updateInventoryBalanceFail),
          ofType(inventoryActions.deleteCountFail)
        ).subscribe(action =>{
          this.commonUIService.notify('Oops. Something went wrong please contact your administration'); 
        })
      )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
    if (this.diff > 0){
      buttons.push({
        text: 'Increase Balance',
        icon: 'arrow-up',
        handler: () => {
          this.adjustBalance();
        }
      });
      buttons.push()
    }
    if (this.diff < 0){
      buttons.push({
        text: 'Decrease Balance',
        icon: 'arrow-down',
        handler: () => {
          this.adjustBalance();
        }
      });
      buttons.push()
    }
    /*
    buttons.push({
      text: 'Archive',
      icon: 'download',
      handler: () => {
        this.archive();
      }
    });
    */
    buttons.push({
      text: 'Delete',
      icon: 'trash',
      handler: () => {
        this.delete();
      }
    });
    
    const actionSheet = await this.actionSheetController.create({
      header: 'Options',
      cssClass: 'my-custom-class',
      buttons: buttons
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  adjustBalance(){
    this.commonUIService.confirmAction('Adjust Inventory', 'Continue and adjust inventory?').then(result => {
      if (result == 'continue') {
        if (this.diff != 0) {
          const transaction = <InventoryTransaction>{
            id:'',
            transactionType: InventoryTransactionType.CountAdjustment,
            itemId: this.item.id,
            transactionOn: new Date(),
            quantityIn: this.diff > 0 ? this.diff : 0 ,
            quantityOut:  this.diff < 0 ? Math.abs(this.diff) : 0,
            reference: `count=${this.count.id}`,
            notes: '',
          }
          this.store.dispatch(inventoryActions.updateInventoryBalance({transaction}))
        }
      }
    });
  }

  archive(){
    this.store.dispatch(inventoryActions.archiveCount({ id: this.count.id }));
  }

  delete(){
    this.commonUIService.confirmAction('Delete Count', 'Continue and delete count?').then(result => {
      if (result == 'continue') {
         this.store.dispatch(inventoryActions.deleteCount({id: this.count.id}));
      }
    });
  }

  ngOnInit() {
  }

}
