import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InventoryItem } from '@app/models/inventory-item';
import { Product } from '@app/models/product';
import { ProductItem } from '@app/models/product-item';
import { AppState } from '@app/state';
import { productActions } from '@app/state/product/product.actions';
import { NavController } from '@ionic/angular';
import { ofType } from '@ngrx/effects';
import { ActionsSubject, Store } from '@ngrx/store';
import { IonicSelectableComponent } from 'ionic-selectable';
import { Subscription } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';

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

  
    if (this.router.getCurrentNavigation().extras.state) {
      this.productItem = this.router.getCurrentNavigation().extras.state.productItem;
      this.productId = this.router.getCurrentNavigation().extras.state.productId;
      this.selectedItem = this.inventoryItems.find(s =>s.id == this.productItem.itemId);
      this.productItemForm = this.formBuilder.group({
        item: [this.selectedItem, Validators.required],
        quantity: [this.productItem.quantity, Validators.required]
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

}
