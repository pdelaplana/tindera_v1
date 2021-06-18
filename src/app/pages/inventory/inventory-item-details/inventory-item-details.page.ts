import { CurrencyPipe } from '@angular/common';
import { ThrowStmt } from '@angular/compiler';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { CATEGORIES } from '@app/models/categories';
import { InventoryItem } from '@app/models/inventory-item';
import { UOMS } from '@app/models/uom';
import { CommonUIService } from '@app/services/common-ui.service';
import { AppState } from '@app/state';
import { inventoryActions } from '@app/state/inventory/inventory.actions';
import { selectInventoryItem } from '@app/state/inventory/inventory.selectors';
import { NavController } from '@ionic/angular';
import { ofType } from '@ngrx/effects';
import { ActionsSubject, Store } from '@ngrx/store';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { concatMap,  debounceTime, take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-inventory-item-details',
  templateUrl: './inventory-item-details.page.html',
  styleUrls: ['./inventory-item-details.page.scss'],
})
export class InventoryItemDetailsPage implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();

  private unsubscribe = new Subject<void>()

  
  itemId: string;

  inventoryItem$:  Observable<InventoryItem>;

  inventoryItemForm : FormGroup;

  categories = CATEGORIES;

  uoms = UOMS;
  
  constructor(
    private store: Store<AppState>,
    private actions: ActionsSubject,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private currencyPipe: CurrencyPipe,
    private navController: NavController,
    private commonUiService: CommonUIService
  ) { 

    /*
    this.route.queryParams.subscribe(_params => {
      this.inventoryItemForm = this.formBuilder.group({
        name: ['', Validators.required],
        description: [''],
        category: [''],
        uom: [''],
        unitCost: [0.00],
        unitCostFormatted: [''],
        currentCount: [0],
        reorderLevel: [0],
        notes: ['']
      },
      { updateOn: 'blur' });
      
      this.inventoryItemForm.valueChanges
        .pipe(
          debounceTime(1500),
          switchMap(form => of(this.save()))
        )
        .subscribe()
      */

      if (this.router.getCurrentNavigation().extras.state) {
        this.itemId = this.router.getCurrentNavigation().extras.state.itemId;
        //this.inventoryItem$ = this.store.select(selectInventoryItem(this.itemId));

        this.store.select(selectInventoryItem(this.itemId)).subscribe(item => {
          
          this.inventoryItemForm = this.formBuilder.group({
            name: [item.name, Validators.required],
            description: [item.description],
            category: [item.category],
            uom: [item.uom],
            unitCost: [item.unitCost],
            unitCostFormatted: [item.unitCost],
            currentCount: [item.currentCount],
            reorderLevel: [item.reorderLevel],
            notes: [item.notes]
          },
          { updateOn: 'blur' });
          
          this.inventoryItemForm.valueChanges
            .pipe(
              debounceTime(1500),
              concatMap(form => of(this.save())),
              takeUntil(this.unsubscribe)
            )
            .subscribe()
          
        });
      }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.unsubscribe.next()
  }

  ngOnInit() {    
    this.subscription
      .add(
        this.actions.pipe(
          ofType(inventoryActions.updateItemSuccess),
          take(1)
        ).subscribe(action =>{

        
        })

      );
  }


  get name() { return this.inventoryItemForm.get('name'); }
  set name(value: any) { this.inventoryItemForm.get('name').setValue(value); }
  
  get description() { return this.inventoryItemForm.get('description'); }
  set description(value: any) { this.inventoryItemForm.get('description').setValue(value); }
  
  get category() { return this.inventoryItemForm.get('category'); }
  set category(value: any) { this.inventoryItemForm.get('category').setValue(value); }
  
  get uom() { return this.inventoryItemForm.get('uom'); }
  set uom(value: any) { this.inventoryItemForm.get('uom').setValue(value); }

  get unitCost() { return this.inventoryItemForm.get('unitCost'); }
  set unitCost(value: any) { this.inventoryItemForm.get('unitCost').setValue(value); }

  get unitCostFormatted() { return this.inventoryItemForm.get('unitCostFormatted'); }
  set unitCostFormatted(value:any) { this.inventoryItemForm.get('unitCostFormatted').setValue(value); }
  
  get currentCount() { return this.inventoryItemForm.get('currentCount'); }
  set currentCount(value: any) { this.inventoryItemForm.get('currentCount').setValue(value); }

  get reorderLevel() { return this.inventoryItemForm.get('reorderLevel'); }
  set reorderLevel(value: any) { this.inventoryItemForm.get('reorderLevel').setValue(value); }

  get notes() { return this.inventoryItemForm.get('notes'); }
  set notes(value: any) { this.inventoryItemForm.get('notes').setValue(value); }

  amountChanged(event: number) {
    this.inventoryItemForm.get('unitCost').setValue(event);
  }

  formatUnitCost(){
    this.unitCost = this.unitCostFormatted.value; 
    this.unitCostFormatted = this.currencyPipe.transform(this.unitCost.value, 'P');
  }

  resetUnitCost(){
    this.unitCostFormatted = this.unitCost.value
  }

  async save(){
    const item = <InventoryItem>{
      id: this.itemId,
      name: this.name.value,
      description: this.description.value,
      category: this.category.value,
      uom: this.uom.value,
      unitCost: this.unitCost.value,
      reorderLevel: this.reorderLevel.value,
      currentCount: this.currentCount.value,
      notes: this.notes.value
    }
   
    return this.store.dispatch(inventoryActions.updateItem({ item }));
  }

  navigateToItemReceive(itemId: string){
    const navigationExtras: NavigationExtras = { state: { itemId: itemId } };
    this.navController.navigateForward('inventory/receive', navigationExtras);
  }

  navigateToItemTransactions(itemId: string){
    const navigationExtras: NavigationExtras = { state: { itemId: itemId } };
    this.navController.navigateForward('inventory/transactions', navigationExtras);
  }

}
