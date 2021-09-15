import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { InventoryAdjustmentReason } from '@app/models/inventory-adjustment-reason';
import { InventoryItem } from '@app/models/inventory-item';
import { InventoryTransaction } from '@app/models/inventory-transaction';
import { inventoryAdjustmentReasons, InventoryAdjustmentType, InventoryTransactionType } from '@app/models/types';
import { CommonUIService } from '@app/services/common-ui.service';
import { AppState } from '@app/state';
import { inventoryActions } from '@app/state/inventory/inventory.actions';
import { selectInventoryItem } from '@app/state/inventory/inventory.selectors';
import { NavController } from '@ionic/angular';
import { ofType } from '@ngrx/effects';
import { ActionsSubject, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-inventory-item-adjustment',
  templateUrl: './inventory-item-adjustment.page.html',
  styleUrls: ['./inventory-item-adjustment.page.scss'],
})
export class InventoryItemAdjustmentPage implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();
  
  item: InventoryItem;
  inventoryAdjustmentForm : FormGroup;

  adjustmentReasons: InventoryAdjustmentReason[];

  constructor(
    private store: Store<AppState>,
    private actions: ActionsSubject,
    private formBuilder: FormBuilder,
    private router: Router,
    private navController: NavController,
    private commonUIService: CommonUIService
  ) { 
    if (this.router.getCurrentNavigation().extras.state) {
      const itemId = this.router.getCurrentNavigation().extras.state.itemId;
      this.store.select(selectInventoryItem(itemId)).subscribe(item => this.item = item);
      this.store.select(state => state.shop).subscribe(shop => this.adjustmentReasons = shop.inventoryAdjustmentReasons);
    } 
    this.inventoryAdjustmentForm = this.formBuilder.group({
      adjustedQty: [0, Validators.required],
      adjustedOn: [new Date().toISOString(), Validators.required],
      adjustmentReason: [''],
      notes: ['']
    });

    this.subscription
      .add(
        this.actions.pipe(
          ofType(inventoryActions.updateInventoryBalanceSuccess),
        ).subscribe(action =>{
          this.commonUIService.notify(`Balance for ${this.item.name} has been adjusted.  The new balance for this item ${this.item.currentCount}`);
          this.store.dispatch(inventoryActions.clearInventoryActions());
          const navigationExtras: NavigationExtras = { state: { itemId: this.item.id } };
          this.navController.navigateForward('inventory/details', navigationExtras);
        })
      )
      .add(
        this.actions.pipe(
          ofType(inventoryActions.updateInventoryBalanceFail),
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

  get adjustedQty() { return this.inventoryAdjustmentForm.get('adjustedQty'); }
  set adjustedQty(value: any) { this.inventoryAdjustmentForm.get('adjustedQty').setValue(value); }

  get adjustedOn() { return this.inventoryAdjustmentForm.get('adjustedOn'); }
  set adjustedOn(value: any) { this.inventoryAdjustmentForm.get('adjustedOn').setValue(value); }

  get adjustmentReason() { return this.inventoryAdjustmentForm.get('adjustmentReason'); }
  set adjustmentReason(value: any) { this.inventoryAdjustmentForm.get('adjustmentReason').setValue(value); }

  get notes() { return this.inventoryAdjustmentForm.get('notes'); }
  set notes(value: any) { this.inventoryAdjustmentForm.get('notes').setValue(value); }

  submit(){
    this.commonUIService.confirmAction('Adjust Inventory', 'Continue and adjust inventory?').then(result => {
      if (result == 'continue') {

        let qtyIn = 0, qtyOut = 0;
        const adjustmentReason = this.adjustmentReason.value; 
        if (adjustmentReason.adjustmentType == InventoryAdjustmentType.Increase){
          qtyIn = this.adjustedQty.value;
        } else if (adjustmentReason.adjustmentType == InventoryAdjustmentType.Decrease) {
          qtyOut = this.adjustedQty.value;
        }

        this.store.dispatch(inventoryActions.updateInventoryBalance({
          transaction : <InventoryTransaction>{
            id:'',
            transactionType: InventoryTransactionType.Adjustment,
            itemId: this.item.id,
            itemName: this.item.name,
            transactionOn: new Date(this.adjustedOn.value),
            quantityIn: qtyIn,
            quantityOut: qtyOut,
            notes: this.notes.value,
            adjustmentReason: adjustmentReason
          }
        }))

      }
    });

    
  }


}
