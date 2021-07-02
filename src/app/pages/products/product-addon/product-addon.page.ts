import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InventoryItem } from '@app/models/inventory-item';
import { ProductAddOn } from '@app/models/product-addon';
import { AppState } from '@app/state';
import { ActionsSubject, Store } from '@ngrx/store';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { IonicSelectableComponent } from 'ionic-selectable';
import { productActions } from '@app/state/product/product.actions';
import { ThrowStmt } from '@angular/compiler';
import { ofType } from '@ngrx/effects';

@Component({
  selector: 'app-product-addon',
  templateUrl: './product-addon.page.html',
  styleUrls: ['./product-addon.page.scss'],
})
export class ProductAddonPage implements OnInit, OnDestroy {

  private productId: string;
  private productAddOn : ProductAddOn;
  private subscription: Subscription = new Subscription();
  
  productAddonForm: FormGroup;
  inventoryItems: InventoryItem[];
  selectedItem: InventoryItem;

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
    ).subscribe(items => this.inventoryItems = items);

    if (this.router.getCurrentNavigation().extras.state) {
      this.productAddOn = this.router.getCurrentNavigation().extras.state.productAddOn;
      this.productId = this.router.getCurrentNavigation().extras.state.productId;
      this.selectedItem = this.inventoryItems.find(i => i.id == this.productAddOn.itemId);
      this.productAddonForm = this.formBuilder.group({
        name: [this.productAddOn.name, Validators.required],
        item: [this.selectedItem],
        free: [this.productAddOn.price == 0],
        price: [this.productAddOn.price],
        quantity: [this.productAddOn.quantity]
      });
    }

    this.subscription
      .add(
        this.actions.pipe(
          ofType(productActions.upsertProductAddonSuccess),
        ).subscribe(action =>{
          this.navController.back();
          this.store.dispatch(productActions.loadProductDetails());
        })
      )

  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
  }

  amountChange(value: number) {
    this.price = value;
  }

  get name() { return this.productAddonForm.get('name'); }
  set name(value: any) { this.productAddonForm.get('name').setValue(value); }

  get item() { return this.productAddonForm.get('item'); }
  set item(value: any) { this.productAddonForm.get('item').setValue(value); }

  get price() { return this.productAddonForm.get('price'); }
  set price(value: any) { this.productAddonForm.get('price').setValue(value); }

  get quantity() { return this.productAddonForm.get('quantity'); }
  set quantity(value: any) { this.productAddonForm.get('quantity').setValue(value); }

  save() {
    if (this.productAddonForm.valid){
      this.store.dispatch(productActions.upsertProductAddon({
        productId: this.productId,
        productAddon : <ProductAddOn>{ 
          name: this.name.value,
          price: this.price.value,
          itemId: this.item.value ? this.item.value.id : '', 
          itemName: this.item.value ? this.item.value.name : '',
          itemCost: this.item.value ? this.item.value.unitCost : 0,
          quantity: this.quantity.value
        }
      }))
    }
  }

}
