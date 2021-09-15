import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InventoryCategory } from '@app/models/inventory-category';
import { InventoryItem } from '@app/models/inventory-item';
import { Product } from '@app/models/product';
import { ProductItem } from '@app/models/product-item';
import { UOMS } from '@app/models/uom';
import { AppState } from '@app/state';
import { inventoryActions } from '@app/state/inventory/inventory.actions';
import { productActions } from '@app/state/product/product.actions';
import { NavController } from '@ionic/angular';
import { ofType } from '@ngrx/effects';
import { ActionsSubject, Store } from '@ngrx/store';
import { IonicSelectableComponent } from 'ionic-selectable';
import { Subscription } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';

@Component({
  selector: 'app-product-bom',
  templateUrl: './product-bom.page.html',
  styleUrls: ['./product-bom.page.scss'],
})
export class ProductBOMPage implements OnInit, OnDestroy {

  private productId: string;
  private productItem : ProductItem;
  private subscription: Subscription = new Subscription();
  
  productItemForm: FormGroup;
  inventoryItems: InventoryItem[];
  selectedItem: InventoryItem;

  addInventoryItemForm : FormGroup;

  categories : InventoryCategory[];
  uoms = UOMS;

  @ViewChild('inventoryItemLookup') inventoryItemLookup: IonicSelectableComponent;
  
  constructor(
    private store: Store<AppState>,
    private actions: ActionsSubject,    
    private router: Router,
    private formBuilder: FormBuilder,
    private navController: NavController
  ) { 

    this.store.select(state => 
      Object.entries(state.inventory.items.entities)
      .map(([id,item]) => item)
    ).subscribe(items => this.inventoryItems = items)

    this.store.select(state => state.shop).subscribe(
      shop => {
        this.categories = shop.inventoryCategories; 
      }
    )

    if (this.router.getCurrentNavigation().extras.state) {
      this.productItem = this.router.getCurrentNavigation().extras.state.productItem;
      this.productId = this.router.getCurrentNavigation().extras.state.productId;
      this.selectedItem = this.inventoryItems.find(s =>s.id == this.productItem.itemId);
      this.productItemForm = this.formBuilder.group({
        item: [this.selectedItem, Validators.required],
        quantity: [this.productItem.quantity, Validators.required]
      });
      this.addInventoryItemForm = this.formBuilder.group({
        name: ['', Validators.required],
        description: [''],
        category: [''],
        uom: [''],
        balance: [0],
        reorderLevel: [0],
        notes: ['']
      });
    }

    this.subscription
      .add(
        this.actions.pipe(
          ofType(productActions.upsertProductItemSuccess),
          withLatestFrom()
        ).subscribe(action =>{
          this.navController.back();
          this.store.dispatch(productActions.loadProductDetails());
        })
      )
      .add(
        this.actions.pipe(
          ofType(inventoryActions.createItemSuccess),
        ).subscribe(action =>{
         // Add port to the top of list.
          this.inventoryItemLookup.addItem(action.item).then(() => {
            this.inventoryItemLookup.search(action.item.name);
          });

          // Clean form.
          this.addInventoryItemForm.reset();
          
          // Show list.
          this.inventoryItemLookup.hideAddItemTemplate();

        })
      )

    
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit() {

    
  }

  get item() { return this.productItemForm.get('item'); }
  set item(value: any) { this.productItemForm.get('item').setValue(value); }

  get quantity() { return this.productItemForm.get('quantity'); }
  set quantity(value: any) { this.productItemForm.get('quantity').setValue(value); }

  get name() { return this.addInventoryItemForm.get('name'); }
  set name(value: any) { this.addInventoryItemForm.get('name').setValue(value); }
  
  get description() { return this.addInventoryItemForm.get('description'); }
  set description(value: any) { this.addInventoryItemForm.get('description').setValue(value); }
  
  get category() { return this.addInventoryItemForm.get('category'); }
  set category(value: any) { this.addInventoryItemForm.get('category').setValue(value); }
  
  get uom() { return this.addInventoryItemForm.get('uom'); }
  set uom(value: any) { this.addInventoryItemForm.get('uom').setValue(value); }

  get balance() { return this.addInventoryItemForm.get('balance'); }
  set balance(value: any) { this.addInventoryItemForm.get('balance').setValue(value); }

  get reorderLevel() { return this.addInventoryItemForm.get('reorderLevel'); }
  set reorderLevel(value: any) { this.addInventoryItemForm.get('reorderLevel').setValue(value); }

  get notes() { return this.addInventoryItemForm.get('notes'); }
  set notes(value: any) { this.addInventoryItemForm.get('notes').setValue(value); }

  addInventoryItem(){
    if (this.addInventoryItemForm.valid){
      this.store.dispatch(inventoryActions.createItem({
        item : <InventoryItem>{
          id: '',
          name: this.name.value,
          description: this.description.value,
          category: this.category.value,
          uom: this.uom.value,
          reorderLevel: this.reorderLevel.value,
          currentCount: this.balance.value,
          notes: this.notes.value
        }
      }));

      
    }
  }

  async save(){
    if (this.productItemForm.valid){
      this.store.dispatch(productActions.upsertProductItem({
        productId: this.productId,
        productItem : <ProductItem>{ 
          itemId: this.item.value.id, 
          itemName: this.item.value.name,
          unitCost: this.item.value.unitCost,
          quantity: this.quantity.value, 
          uom: 'piece' 
        }
      }))
    }
  }

  onAddInventoryItem(event: {
    component: IonicSelectableComponent
  }) {
    // Clean form.
    this.addInventoryItemForm.reset();
    
    // Copy search text to port name field, so
    // user doesn't have to type again.
    this.name.setValue(event.component.searchText);

    // Show form.
    event.component.showAddItemTemplate();
  }

}
