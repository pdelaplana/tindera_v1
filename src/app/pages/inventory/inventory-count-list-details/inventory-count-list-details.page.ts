import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { InventoryAdjustmentReason } from '@app/models/inventory-adjustment-reason';
import { InventoryCount } from '@app/models/inventory-count';
import { InventoryItem } from '@app/models/inventory-item';
import { InventoryTransaction } from '@app/models/inventory-transaction';
import { inventoryAdjustmentReasons, InventoryTransactionType } from '@app/models/types';
import { User } from '@app/models/user';
import { CommonUIService } from '@app/services/common-ui.service';
import { AppState } from '@app/state';
import { selectAuthUser } from '@app/state/auth/auth.selectors';
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
  private user: User;
  
  diff: number;
  count: InventoryCount;
  item: InventoryItem;
  inventoryItemsFormArray: FormArray;
  inventoryCountForm: FormGroup;
  inventoryAdjustmentReasons: InventoryAdjustmentReason[];
  
  constructor(
    private store: Store<AppState>,
    private actions: ActionsSubject,
    private router: Router,
    private formBuilder: FormBuilder,
    public actionSheetController: ActionSheetController,
    private navController: NavController,
    private commonUIService: CommonUIService
  ) { 
    this.store.select(state => state.shop).subscribe(shop => this.inventoryAdjustmentReasons = shop.inventoryAdjustmentReasons);
    this.store.select(selectAuthUser()).subscribe(user => this.user = user);
    if (this.router.getCurrentNavigation().extras.state) {
      const countId = this.router.getCurrentNavigation().extras.state.countId;
      this.store.select(selectInventoryCount(countId)).subscribe(count => {
        this.count = count
        this.inventoryItemsFormArray = new FormArray([]);
        this.count.countItems.forEach(item => {
          this.inventoryItemsFormArray.push(this.formBuilder.group({
            itemId: [item.itemId],
            itemName: [item.itemName],
            onHand: [item.onHand],
            counted: [item.counted],
            category: [item.category],
            countedOn: [item.countedOn] 
          }))
        });

        /*
        this.store.select(selectInventoryItem(count.itemId)).subscribe(item => {
          this.item = item;
          this.diff = this.count.count - this.item.currentCount;
        });
        */
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
          ofType(inventoryActions.updateInventoryCountSuccess)
        ).subscribe(action =>{
          this.commonUIService.notify(`Counts have been updated`);
          this.store.dispatch(inventoryActions.clearInventoryActions());
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

  ngOnInit() {
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
      text: 'Save',
      icon: 'save',
      handler: () =>{
        this.update();
      }
    }),
    buttons.push({
      text: 'Submit',
      icon: 'checkbox',
      handler: () =>{
        this.submit();
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
      cssClass: 'my-custom-class',
      buttons: buttons
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
    
  }

  submit(){
    this.commonUIService.confirmAction('Submit Count', 'Continue and submit count?').then(result => {
      if (result == 'continue') {
        this.update();
        this.store.dispatch(inventoryActions.submitCount({ id: this.count.id }));    
      }
    });
  }

  update(){
    const countedItems = [];
    this.inventoryItemsFormArray.controls.forEach(group => {
      let item = this.count.countItems.find(i => i.itemId == group.get('itemId').value);
      item = { ...item, counted:group.get('counted').value, countedOn: new Date(), countedBy: this.user };
      countedItems.push(item);
    })
    this.store.dispatch(inventoryActions.updateInventoryCount({count: { ...this.count, countItems: countedItems }}));
  }

  adjustBalance(){
    this.commonUIService.confirmAction('Adjust Inventory', 'Continue and adjust inventory?').then(result => {
      if (result == 'continue') {
        if (this.diff != 0) {
          const adjustmenReasonCode = (this.diff > 0) ? 'COUNTIN' : 'COUNTOUT';
        
          const transaction = <InventoryTransaction>{
            id:'',
            transactionType: InventoryTransactionType.Adjustment,
            itemId: this.item.id,
            itemName: this.item.name,
            transactionOn: new Date(),
            quantityIn: this.diff > 0 ? this.diff : 0 ,
            quantityOut:  this.diff < 0 ? Math.abs(this.diff) : 0,
            reference: `count=${this.count.id}`,
            notes: '',
            adjustmentReason: this.inventoryAdjustmentReasons.find(reason => reason.code == adjustmenReasonCode),
            unitCost: this.item.costOfQtyReceivedToDate
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

  

}
