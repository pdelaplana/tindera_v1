import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from '@app/models/product';
import { AppState } from '@app/state';
import { productActions } from '@app/state/product/product.actions';
import { ModalController } from '@ionic/angular';
import { ofType } from '@ngrx/effects';
import { ActionsSubject, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.page.html',
  styleUrls: ['./product-add.page.scss'],
})
export class ProductAddPage implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();
  
  productForm: FormGroup;

  constructor(
    private store: Store<AppState>,
    private actions: ActionsSubject,
    private formBuilder: FormBuilder,
    private modalController: ModalController,
  ) { 
    this.productForm = this.formBuilder.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      description: [''],
      tags: [[]],
      price: [0.00],
      priceFormatted: ['0.00'],
      remarks: [''],
    });

    this.subscription
      .add(
        this.actions.pipe(
          ofType(productActions.createProductSuccess),
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

  /*
  formatUnitCost(){
    this.price = this.priceFormatted.value; 
    this.priceFormatted = this.currencyPipe.transform(this.price.value, 'P');
  }

  resetUnitCost(){
    this.priceFormatted = this.price.value
  }
  */

  onTagsChange(value){
    console.log(value)
  }

  close(){
    this.modalController.dismiss({
      dismissed: true
    });
  }

  save(){
    if (this.productForm.valid){
      this.store.dispatch(productActions.createProduct({
        product : <Product>{
          id: '',
          code: this.code.value,
          name: this.name.value,
          tags: this.tags.value,
          description: this.description.value,
          price: this.price.value,
          remarks: this.remarks.value
        }
      }))
    }
  }

}
