import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { InventoryCount } from '@app/models/inventory-count';
import { InventoryCountItem } from '@app/models/inventory-count-item';
import { User } from '@app/models/user';
import { CommonUIService } from '@app/services/common-ui.service';
import { AppState } from '@app/state';
import { selectAuthUser } from '@app/state/auth/auth.selectors';
import { inventoryActions } from '@app/state/inventory/inventory.actions';
import { selectInventoryCount } from '@app/state/inventory/inventory.selectors';
import { ActionSheetController, NavController } from '@ionic/angular';
import { ofType } from '@ngrx/effects';
import { ActionsSubject, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-inventory-count-items',
  templateUrl: './inventory-count-items.page.html',
  styleUrls: ['./inventory-count-items.page.scss'],
})
export class InventoryCountItemsPage implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();
  private user: User;
  
  count: InventoryCount;
  inventoryItemsFormArray: FormArray;
  
  constructor(
    private store: Store<AppState>,
    private actions: ActionsSubject,
    private router: Router,
    private formBuilder: FormBuilder,
    public actionSheetController: ActionSheetController,
    private navController: NavController,
    private commonUIService: CommonUIService
  ) { 
    this.store.select(selectAuthUser()).subscribe(user => this.user = user);
    if (this.router.getCurrentNavigation().extras.state) {
      const countId = this.router.getCurrentNavigation().extras.state.countId;
      this.store.select(selectInventoryCount(countId)).subscribe(count => {
        this.count = count
        this.inventoryItemsFormArray = new FormArray([]);
        this.count.countItems.slice().sort((a: InventoryCountItem, b: InventoryCountItem) => {
          return a.itemName > b.itemName ? 1 : -1;
        }).forEach(item => {
          this.inventoryItemsFormArray.push(this.formBuilder.group({
            itemId: [item.itemId],
            itemName: [item.itemName],
            onHand: [item.onHand],
            counted: [item.counted],
            category: [item.category],
            countedOn: [item.countedOn] 
          }))
        });
      });
    }

    this.subscription
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
    
  }

  ngOnInit() {
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
    if (this.inventoryItemsFormArray.dirty){
      this.commonUIService.notifyError('Please save changes before submitting.');
      return;
    }

    this.commonUIService.confirmAction('Submit Count', 'Continue and submit count?').then(result => {
      if (result == 'continue') {
       
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

  delete(){
    this.commonUIService.confirmAction('Delete Count', 'Continue and delete count?').then(result => {
      if (result == 'continue') {
         this.store.dispatch(inventoryActions.deleteCount({id: this.count.id}));
      }
    });
  }

  
}
