import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { InventoryItem } from '@app/models/inventory-item';
import { InventoryTransaction } from '@app/models/inventory-transaction';
import { InventoryTransactionType } from '@app/models/types';
import { CommonUIService } from '@app/services/common-ui.service';
import { AppState } from '@app/state';
import { inventoryActions } from '@app/state/inventory/inventory.actions';
import { selectInventoryItem } from '@app/state/inventory/inventory.selectors';
import { NavController } from '@ionic/angular';
import { ofType } from '@ngrx/effects';
import { ActionsSubject, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-inventory-item-receive',
  templateUrl: './inventory-item-receive.page.html',
  styleUrls: ['./inventory-item-receive.page.scss'],
})
export class InventoryItemReceivePage implements OnInit {

  private subscription: Subscription = new Subscription();
  
  itemId: string;
  itemName: string;
  item$: Observable<InventoryItem>;
  inventoryReceiveForm : FormGroup;

  constructor(
    private store: Store<AppState>,
    private actions: ActionsSubject,
    private formBuilder: FormBuilder,
    private router: Router,
    private navController: NavController,
    private commonUIService: CommonUIService
  ) {
    if (this.router.getCurrentNavigation().extras.state) {
      this.itemId = this.router.getCurrentNavigation().extras.state.itemId;
    } 
    this.item$ = this.store.select(selectInventoryItem(this.itemId));
    this.item$.subscribe(item => this.itemName = item.name)

    this.inventoryReceiveForm = this.formBuilder.group({
      count: [0, Validators.required],
      receivedOn: [new Date().toISOString(), Validators.required],
      reference: [''],
      notes: [''],
      supplier: [''],
      unitCost: [0.0, Validators.required]
    });

    this.subscription
    .add(
      this.actions.pipe(
        ofType(inventoryActions.receiveItemSuccess),
      ).subscribe(action =>{
        //this.commonUIService.notify(`Balance for ${this.item.name} has been adjusted.  The new balance for this item ${this.item.currentCount}`);
        this.store.dispatch(inventoryActions.clearInventoryActions());
        const navigationExtras: NavigationExtras = { state: { itemId: this.itemId } };
        this.navController.navigateForward('inventory/details', navigationExtras);
      })
    )
    .add(
      this.actions.pipe(
        ofType(inventoryActions.receiveItemFail),
      ).subscribe(action =>{
        this.commonUIService.notify('Oops. Something went wrong please contact your administration'); 
      })
    )
   
  }

  ngOnInit() {
  }

  get count() { return this.inventoryReceiveForm.get('count'); }
  set count(value: any) { this.inventoryReceiveForm.get('count').setValue(value); }

  get receivedOn() { return this.inventoryReceiveForm.get('receivedOn'); }
  set receivedOn(value: any) { this.inventoryReceiveForm.get('receivedOn').setValue(value); }

  get notes() { return this.inventoryReceiveForm.get('notes'); }
  set notes(value: any) { this.inventoryReceiveForm.get('notes').setValue(value); }

  get reference() { return this.inventoryReceiveForm.get('reference'); }
  set reference(value: any) { this.inventoryReceiveForm.get('reference').setValue(value); }

  get supplier() { return this.inventoryReceiveForm.get('supplier'); }
  set supplier(value: any) { this.inventoryReceiveForm.get('supplier').setValue(value); }

  get unitCost() { return this.inventoryReceiveForm.get('unitCost'); }
  set unitCost(value: any) { this.inventoryReceiveForm.get('unitCost').setValue(value); }

  amountChange(value: number) {
    this.unitCost = value;
  }

  save(){
    if (this.inventoryReceiveForm.valid){
      this.store.dispatch(inventoryActions.receiveItem({
        itemId: this.itemId,
        itemName: this.itemName,
        receivedOn: new Date(this.receivedOn.value),
        qtyReceived:Number(this.count.value),
        reference: this.reference.value ?? '',
        notes: this.notes.value ?? '',
        supplier: this.supplier.value ?? '',
        unitCost: Number(this.unitCost.value)
      }))
    }
   
  }

}
