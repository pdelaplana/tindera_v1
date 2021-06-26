import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { Product } from '@app/models/product';
import { ProductItem } from '@app/models/product-item';
import { CommonUIService } from '@app/services/common-ui.service';
import { AppState } from '@app/state';
import { productActions } from '@app/state/product/product.actions';
import { selectProduct } from '@app/state/product/product.selectors';
import { NavController } from '@ionic/angular';
import { ActionsSubject, Store } from '@ngrx/store';
import { of, Subject } from 'rxjs';
import { concatMap, debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
})
export class ProductDetailsPage implements OnInit, OnDestroy {

  private unsubscribe = new Subject<void>()
  
  productId: string;
  productForm: FormGroup;
  productItems: ProductItem[] = [];
  constructor(
    private store: Store<AppState>,
    private actions: ActionsSubject,
    private router: Router,
    private formBuilder: FormBuilder,
    private navController: NavController,
    private commonUIService: CommonUIService
  ) { 
    if (this.router.getCurrentNavigation().extras.state) {
      this.productId = this.router.getCurrentNavigation().extras.state.productId;
      
      this.store.select(selectProduct(this.productId)).subscribe(product => {
        
        this.productItems = product.productItems ?? [];

        this.productForm = this.formBuilder.group({
          code: [product.code, Validators.required],
          name: [product.name, Validators.required],
          description: [product.description],
          tags: [product.tags],
          price: [product.price],
          priceFormatted: ['0.00'],
          remarks: [product.remarks],
        },
        { updateOn: 'blur' });
        
        this.productForm.valueChanges
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
    this.unsubscribe.next();
  }

  ngOnInit() {
  }

  get code() { return this.productForm.get('code'); }
  set code(value: any) { this.productForm.get('code').setValue(value); }

  get name() { return this.productForm.get('name'); }
  set name(value: any) { this.productForm.get('name').setValue(value); }

  get description() { return this.productForm.get('description'); }
  set description(value: any) { this.productForm.get('description').setValue(value); }

  get tags() { return this.productForm.get('tags'); }
  set tags(value: any) { this.productForm.get('tags').setValue(value); }

  get price() { return this.productForm.get('price'); }
  set price(value: any) { this.productForm.get('price').setValue(value); }

  get priceFormatted() { return this.productForm.get('priceFormatted'); }
  set priceFormatted(value: any) { this.productForm.get('priceFormatted').setValue(value); }

  get remarks() { return this.productForm.get('remarks'); }
  set remarks(value: any) { this.productForm.get('remarks').setValue(value); }

  navigateToBOM(productId: string, productItem: ProductItem){
    if (productItem == null) {
      productItem = <ProductItem>{
        itemId: '1GefVCT2WushlcNjPdYP',
        item: null,
        quantity: 1
      }
    }
    const navigationExtras: NavigationExtras = { state: { productId, productItem } };
    this.navController.navigateForward('products/bom', navigationExtras);
  }

  deleteItem(productId: string, productItem: ProductItem){
    this.commonUIService.confirmDelete().then(result => {
      if (result == 'continue') {
        this.store.dispatch(productActions.deleteProductItem({ productId, productItem }))
      }
    });
  }

  async save(){
    if (this.productForm.valid){
      this.store.dispatch(productActions.updateProduct({
        product : <Product>{
          id: this.productId,
          code: this.code.value,
          name: this.name.value,
          tags: this.tags.value,
          description: this.description.value,
          price: this.price.value,
          remarks: this.remarks.value,
          productItems: this.productItems
        }
      }))
    }
  }
  
}
