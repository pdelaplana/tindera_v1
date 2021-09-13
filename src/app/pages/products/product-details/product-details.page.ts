import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { Product } from '@app/models/product';
import { ProductAddOn } from '@app/models/product-addon';
import { ProductCategory } from '@app/models/product-category';
import { ProductItem } from '@app/models/product-item';
import { CommonUIService } from '@app/services/common-ui.service';
import { AppState } from '@app/state';
import { productActions } from '@app/state/product/product.actions';
import { selectProduct } from '@app/state/product/product.selectors';
import {  NavController } from '@ionic/angular';
import { ActionsSubject, Store } from '@ngrx/store';
import { Ng2ImgMaxService } from 'ng2-img-max';
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
  productAddOns: ProductAddOn[] =[];
  imageUrl: string;
  productCategories: ProductCategory[];

  constructor(
    private store: Store<AppState>,
    private actions: ActionsSubject,
    private router: Router,
    private formBuilder: FormBuilder,
    private navController: NavController,
    private commonUIService: CommonUIService,
    private ng2ImgMaxService: Ng2ImgMaxService 
  ) { 
    if (this.router.getCurrentNavigation().extras.state) {
      this.productId = this.router.getCurrentNavigation().extras.state.productId;
      
      this.store.select(state => state.shop).subscribe(shop => {
        this.productCategories = shop.productCategories;

        this.store.select(selectProduct(this.productId)).subscribe(product => {
        
          this.productItems = product.productItems ?? [];
          this.productAddOns = product.productAddOns ?? [];
          this.imageUrl = product.imageUrl;
          
          const category = this.productCategories.find(c => c.code == product.productCategory?.code)
          this.productForm = this.formBuilder.group({
            name: [product.name, Validators.required],
            description: [product.description],
            tags: [product.tags],
            price: [product.price],
            priceFormatted: ['0.00'],
            remarks: [product.remarks],
            productCategory: [category ?? null]
          },
          { updateOn: 'blur' });
          
          this.productForm.valueChanges
            .pipe(
              debounceTime(1000),
              concatMap(form => of(this.save())),
              takeUntil(this.unsubscribe)
            )
            .subscribe()
          
        });
      });

      
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
  }

  ngOnInit() {
  }

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

  get productCategory() { return this.productForm.get('productCategory'); }
  set productCategory(value: any) { this.productForm.get('productCategory').setValue(value); }

  navigateToBOM(productId: string, productItem: ProductItem){
    if (productItem == null) {
      productItem = <ProductItem>{
        itemId: '',
        itemName: '',
        unitCost: 0,
        quantity: 1
      }
    }
    const navigationExtras: NavigationExtras = { state: { productId, productItem } };
    this.navController.navigateForward('products/bom', navigationExtras);
  }

  navigateToAddOn(productId: string, productAddOn: ProductAddOn){
    
    if (productAddOn == null) {
      productAddOn = <ProductAddOn>{
        name: '',
        itemId: '',
        itemName: '',
        itemCost: 0,
        price: 0,
        quantity: 0
      }
    }
    
    const navigationExtras: NavigationExtras = { state: { productId, productAddOn } };
    this.navController.navigateForward('products/addon', navigationExtras);
    
  }


  async uploadFile(files: FileList){
    const file = files.item(0);
    const fileName = file['name'];

    this.ng2ImgMaxService.resizeImage(file, 10000, 300).subscribe(
      result => {
        const imageFile = new File([result], fileName, { type: 'image/jpg' });
        this.store.dispatch(productActions.uploadProductPhoto({ productId: this.productId, file: imageFile }))
      },
      error => {
        console.log(error);
      }
    )
  }


  removeFile(){
    this.store.dispatch(productActions.deleteProductPhoto({ productId: this.productId, url: this.imageUrl}));
  }


  deleteItem(productId: string, productItem: ProductItem){
    this.commonUIService.confirmDelete().then(result => {
      if (result == 'continue') {
        this.store.dispatch(productActions.deleteProductItem({ productId, productItem }))
      }
    });
  }

  deleteAddon(productId: string, productAddon: ProductAddOn){
    this.commonUIService.confirmDelete().then(result => {
      if (result == 'continue') {
        this.store.dispatch(productActions.deleteProductAddon({ productId,productAddon }))
      }
    });
  }

  amountChange(value: number) {
    this.price = value;
  }


  async save(){
    if (this.productForm.valid){
      this.store.dispatch(productActions.updateProduct({
        product : <Product>{
          id: this.productId,
          name: this.name.value,
          tags: this.tags.value,
          description: this.description.value,
          price: this.price.value,
          remarks: this.remarks.value,
          imageUrl: this.imageUrl ?? '',
          productItems: this.productItems,
          productCategory: this.productCategory.value
        }
      }))
    }
  }
  
}
