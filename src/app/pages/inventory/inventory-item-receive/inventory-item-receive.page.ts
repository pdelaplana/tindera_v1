import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InventoryItem } from '@app/models/inventory-item';
import { InventoryTransaction } from '@app/models/inventory-transaction';
import { InventoryTransactionType } from '@app/models/types';
import { AppState } from '@app/state';
import { inventoryActions } from '@app/state/inventory/inventory.actions';
import { selectInventoryItem } from '@app/state/inventory/inventory.selectors';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-inventory-item-receive',
  templateUrl: './inventory-item-receive.page.html',
  styleUrls: ['./inventory-item-receive.page.scss'],
})
export class InventoryItemReceivePage implements OnInit {

  itemId: string;
  item$: Observable<InventoryItem>;
  inventoryReceiveForm : FormGroup;

  constructor(
    private store: Store<AppState>,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    if (this.router.getCurrentNavigation().extras.state) {
      this.itemId = this.router.getCurrentNavigation().extras.state.itemId;
    } 
    this.item$ = this.store.select(selectInventoryItem(this.itemId));

    this.inventoryReceiveForm = this.formBuilder.group({
      count: [0, Validators.required],
      receivedOn: [new Date().toISOString(), Validators.required],
      reference: [''],
      notes: ['']
    });
   
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

  save(){
    this.store.dispatch(inventoryActions.receiveItem({
      transaction : <InventoryTransaction>{
        id:'',
        transactionType: InventoryTransactionType.Receipt,
        itemId: this.itemId,
        transactionOn: this.receivedOn.value,
        quantityIn: Number(this.count.value),
        quantityOut: 0,
        reference: this.reference.value,
        notes: this.notes.value,
      }
    }))
  }

}
