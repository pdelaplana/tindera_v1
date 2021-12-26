import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { InventoryAdjustmentReason } from '@app/models/inventory-adjustment-reason';
import { InventoryCount } from '@app/models/inventory-count';
import { InventoryCountItem } from '@app/models/inventory-count-item';
import { InventoryTransaction } from '@app/models/inventory-transaction';
import { InventoryTransactionType } from '@app/models/types';
import { CommonUIService } from '@app/services/common-ui.service';
import { AppState } from '@app/state';
import { inventoryActions } from '@app/state/inventory/inventory.actions';
import { selectInventoryCount } from '@app/state/inventory/inventory.selectors';
import { NavController } from '@ionic/angular';
import { ofType } from '@ngrx/effects';
import { ActionsSubject, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-inventory-count-item-adjustment',
  templateUrl: './inventory-count-item-adjustment.page.html',
  styleUrls: ['./inventory-count-item-adjustment.page.scss'],
})
export class InventoryCountItemAdjustmentPage implements OnInit,OnDestroy {

  private subscription: Subscription = new Subscription();
  
  count: InventoryCount;
  item: InventoryCountItem;
  inventoryAdjustmentReasons: InventoryAdjustmentReason[];

  inventoryAdjustmentForm: FormGroup;
  
  constructor(
    private store: Store<AppState>,
    private actions: ActionsSubject,
    private formBuilder: FormBuilder,
    private router: Router,
    private navController: NavController,
    private commonUIService: CommonUIService
  ) { 
    
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
    this.store.select(state => state.shop).subscribe(shop => this.inventoryAdjustmentReasons = shop.inventoryAdjustmentReasons);

    if (this.router.getCurrentNavigation().extras.state) {
      const countId = this.router.getCurrentNavigation().extras.state.countId;
      const itemId = this.router.getCurrentNavigation().extras.state.itemId;
      
      this.store.select(selectInventoryCount(countId)).subscribe(count => {
        this.count = count;
        this.item = count.countItems.find(item => item.itemId == itemId);
      });
    }

    this.inventoryAdjustmentForm = this.formBuilder.group({
      adjustedQty: [Math.abs(this.item.counted-this.item.onHand), Validators.required],
      adjustedOn: [new Date().toISOString(), Validators.required],
      adjustmentReason: [''],
      notes: ['']
    });

    this.subscription
      .add(
        this.actions.pipe(
          ofType(inventoryActions.updateInventoryBalanceSuccess),
        ).subscribe(action =>{
          this.commonUIService.notify(`Balance for ${this.item.itemName} has been adjusted.  The new balance for this item ${this.item.counted}`);
          this.store.dispatch(inventoryActions.closeCountItem({countId: this.count.id, itemId: action.transaction.itemId }))
        })
      )
      .add(
        this.actions.pipe(
          ofType(inventoryActions.closeCountItemSuccess),
        ).subscribe(action =>{
          this.store.dispatch(inventoryActions.clearInventoryActions());
          const navigationExtras: NavigationExtras = { state: { countId: this.count.id } };
          this.navController.navigateForward('inventory/count/items', navigationExtras);
        })
      )
  }

  get adjustedQty() { return this.inventoryAdjustmentForm.get('adjustedQty'); }
  set adjustedQty(value: any) { this.inventoryAdjustmentForm.get('adjustedQty').setValue(value); }

  get adjustedOn() { return this.inventoryAdjustmentForm.get('adjustedOn'); }
  set adjustedOn(value: any) { this.inventoryAdjustmentForm.get('adjustedOn').setValue(value); }

  get adjustmentReason() { return this.inventoryAdjustmentForm.get('adjustmentReason'); }
  set adjustmentReason(value: any) { this.inventoryAdjustmentForm.get('adjustmentReason').setValue(value); }

  get notes() { return this.inventoryAdjustmentForm.get('notes'); }
  set notes(value: any) { this.inventoryAdjustmentForm.get('notes').setValue(value); }


  adjustBalance(){
    this.commonUIService.confirmAction('Adjust Inventory', 'Continue and adjust inventory?').then(result => {
      if (result == 'continue') {
        const diff = this.item.counted - this.item.onHand ;
        if (diff != 0) {
          //const adjustmenReasonCode = (diff > 0) ? 'COUNTIN' : 'COUNTOUT';
          const transaction = <InventoryTransaction>{
            id:'',
            transactionType: InventoryTransactionType.Adjustment,
            itemId: this.item.itemId,
            itemName: this.item.itemName,
            transactionOn: new Date(),
            quantityIn: diff > 0 ? diff : 0 ,
            quantityOut:  diff < 0 ? Math.abs(diff) : 0,
            reference: `count=${this.count.id}`,
            notes: '',
            adjustmentReason: this.adjustmentReason.value,
          }
          this.store.dispatch(inventoryActions.updateInventoryBalance({transaction}))
        }
      }
    });
  }

}
