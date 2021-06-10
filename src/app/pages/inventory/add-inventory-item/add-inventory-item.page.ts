import { CurrencyPipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CATEGORIES } from '@app/models/categories';
import { InventoryItem } from '@app/models/inventory-item';
import { UOMS } from '@app/models/uom';
import { CommonUIService } from '@app/services/common-ui.service';
import { ErrorMessages } from '@app/services/error-messages';
import { AppState } from '@app/state';
import { inventoryActions } from '@app/state/inventory/inventory.actions';
import { ModalController } from '@ionic/angular';
import { ofType } from '@ngrx/effects';
import { ActionsSubject, Store } from '@ngrx/store';
import { DevtoolsDispatcher } from '@ngrx/store-devtools/src/devtools-dispatcher';
import { Subscription } from 'rxjs';
import { switchMap, take, takeLast, takeUntil, takeWhile, withLatestFrom } from 'rxjs/operators';

@Component({
  selector: 'app-add-inventory-item',
  templateUrl: './add-inventory-item.page.html',
  styleUrls: ['./add-inventory-item.page.scss'],
})
export class AddInventoryItemPage implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();

  addInventoryItemForm : FormGroup;

  errorMessages = ErrorMessages;

  categories = CATEGORIES;

  uoms = UOMS;
  
  constructor(
    private store: Store<AppState>,
    private actions: ActionsSubject,
    private formBuilder: FormBuilder,
    private currencyPipe: CurrencyPipe,
    private modalController: ModalController,
    private commonUiService: CommonUIService 
  ) { 
    this.addInventoryItemForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      category: [''],
      uom: [''],
      unitCost: [0.00],
      unitCostFormatted: ['0.00'],
      balance: [0],
      reorderLevel: [0],
      notes: ['']
    });

    this.subscription
      .add(
        this.actions.pipe(
          ofType(inventoryActions.createItemSuccess),
          take(1)
        ).subscribe(action =>{
          this.modalController.dismiss({dismissed: true});
        })
      )
      
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
    
  }

  get name() { return this.addInventoryItemForm.get('name'); }
  set name(value: any) { this.addInventoryItemForm.get('name').setValue(value); }
  
  get description() { return this.addInventoryItemForm.get('description'); }
  set description(value: any) { this.addInventoryItemForm.get('description').setValue(value); }
  
  get category() { return this.addInventoryItemForm.get('category'); }
  set category(value: any) { this.addInventoryItemForm.get('category').setValue(value); }
  
  get uom() { return this.addInventoryItemForm.get('uom'); }
  set uom(value: any) { this.addInventoryItemForm.get('uom').setValue(value); }

  get unitCost() { return this.addInventoryItemForm.get('unitCost'); }
  set unitCost(value: any) { this.addInventoryItemForm.get('unitCost').setValue(value); }

  get unitCostFormatted() { return this.addInventoryItemForm.get('unitCostFormatted'); }
  set unitCostFormatted(value:any) { this.addInventoryItemForm.get('unitCostFormatted').setValue(value); }
  
  get balance() { return this.addInventoryItemForm.get('balance'); }
  set balance(value: any) { this.addInventoryItemForm.get('balance').setValue(value); }

  get reorderLevel() { return this.addInventoryItemForm.get('reorderLevel'); }
  set reorderLevel(value: any) { this.addInventoryItemForm.get('reorderLevel').setValue(value); }

  get notes() { return this.addInventoryItemForm.get('notes'); }
  set notes(value: any) { this.addInventoryItemForm.get('notes').setValue(value); }

  amountChanged(event: number) {
    this.addInventoryItemForm.get('unitCost').setValue(event);
  }

  formatUnitCost(){
    this.unitCost = this.unitCostFormatted.value; 
    this.unitCostFormatted = this.currencyPipe.transform(this.unitCost.value, 'P');
  }

  resetUnitCost(){
    this.unitCostFormatted = this.unitCost.value
  }

  close(){
    this.modalController.dismiss({
      dismissed: true
    });
  }

  save(){
    this.store.dispatch(inventoryActions.createItem({
      item : <InventoryItem>{
        id: '',
        name: this.name.value,
        description: this.description.value,
        category: this.category.value,
        uom: this.uom.value,
        unitCost: this.unitCost.value,
        reorderLevel: this.reorderLevel.value,
        currentCount: this.balance.value,
        notes: this.notes.value
      }
    }))
  }

}
