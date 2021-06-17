import { Injectable } from '@angular/core';
import { Product } from '@app/models/product';
import { ProductItem } from '@app/models/product-item';
import { CommonUIService } from '@app/services/common-ui.service';
import { ProductService } from '@app/services/firestore/product.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, debounceTime, map, switchMap } from 'rxjs/operators';
import { AppState } from '..';
import { productActions } from './product.actions';

@Injectable()
export class ProductEffects{
  private uid: string;
  private shopid: string;
  constructor(
    private store: Store<AppState>,
    private actions: Actions,
    private commonUiService: CommonUIService,
    private productService: ProductService
  ) {
    this.store.select(state => state.auth.uid).subscribe(uid => this.uid = uid);
    this.store.select(state => state.shop.id).subscribe(
      shopid => this.shopid = shopid
    );
  }

  loadProducts = createEffect(() => this.actions.pipe(
    ofType(productActions.loadProducts),
    switchMap(action => {
      const result = this.productService.query([]);
      return result.pipe()
    }),

    map( arr => {
      return productActions.loadProductsSuccess({products: arr})
    }),

    catchError((error, caught) => {
      this.store.dispatch(productActions.loadProductsFail({error}));
      return caught;
    })
  ));

  createProduct = createEffect(() => this.actions.pipe(
    ofType(productActions.createProduct),
    switchMap(async (action) => {
      const data = <Product>{
        id:'',
        code: action.product.code,
        name: action.product.name,
        description: action.product.description,
        price: action.product.price,
        tags: action.product.tags,
        productItems:[]
      }
      const result = await this.productService.add(data)
      return productActions.createProductSuccess({
        product: result
      })
    }),
    catchError((error, caught) => {
      this.store.dispatch(productActions.createProductFail({error}));
      return caught;
    })
  ));

  createProductSuccess = createEffect(() => this.actions.pipe(
    ofType(productActions.createProductSuccess),
    map((action) => {
      this.commonUiService.notify('New product  created');
    })
  ), { dispatch: false });

  createProductFail = createEffect(() => this.actions.pipe(
    ofType(productActions.createProductFail),
    map((action) => {
      this.commonUiService.notify('Opps. We are aunable to create the product.  Please try again');
    })  
  ), { dispatch: false });

  updateProduct = createEffect(() => this.actions.pipe(
    ofType(productActions.updateProduct),
    //withLatestFrom(this.store),
    debounceTime(500),
    switchMap(async (action, state) => {
     
      const data = <Product>{
        id: action.product.id,
        code: action.product.code,
        name: action.product.name,
        description: action.product.description,
        price: action.product.price,
        tags: action.product.tags,
        remarks: action.product.remarks,
        productItems: action.product.productItems
      }
      const product = await (this.productService.update(data));

      return productActions.updateProductSuccess({
        update: {
          id: product.id,
          changes: { 
            code: product.code,
            name: product.name,
            description: product.description,
            price: product.price,
            tags: product.tags,
            remarks: product.remarks
          }
        } 
      })

    }),
    catchError((error, caught) => {
      this.store.dispatch(productActions.updateProductFail({error}));
      return caught;
    })
  ));

  updateProductSuccess = createEffect(() => this.actions.pipe(
    ofType(productActions.updateProductSuccess),
    map((action) => {
      this.commonUiService.notify('Product has been updated.');
    })
  ),{ dispatch: false });

  updateProductFail = createEffect(() => this.actions.pipe(
    ofType(productActions.updateProductFail),
    map((action) => {
      this.commonUiService.notify('Oops. We are aunable to update the product.  Please try again');
      return null;
    })  
  ),{ dispatch: false });

  upsertProductItem = createEffect(() => this.actions.pipe(
    ofType(productActions.upsertProductItem),
    switchMap(async (action) => {
      const product = await this.productService.get(action.productId);
      let productItems = product.productItems; 
      if (productItems == null) {
        productItems = [];
      }
      const productItem = productItems.find(i => i.itemId == action.productItem.itemId);

      if (productItem != null) {
        Object.assign(productItem, action.productItem);
      } else {
        productItems.push(<ProductItem>{ 
          itemId: action.productItem.itemId, 
          item: action.productItem.item,
          quantity: action.productItem.quantity, 
          uom: action.productItem.uom 
        })
      }
      product.productItems = productItems;
      await this.productService.update(product);
      return productActions.upsertProductItemSuccess({productId: action.productId, productItems: productItems });
    }),
    catchError((error, caught) => {
      this.store.dispatch(productActions.upsertProductItemFail({error}));
      return caught;
    })
  ));

  upsertProductItemSuccess = createEffect(() => this.actions.pipe(
    ofType(productActions.upsertProductItemSuccess),
    map((action) => {
      this.commonUiService.notify('Product item has been updated.');
    })
  ), {dispatch: false});

  deleteProductItem = createEffect(() => this.actions.pipe(
    ofType(productActions.deleteProductItem),
    switchMap(async (action) =>{
      const product = await this.productService.get(action.productId);
      let productItems = product.productItems; 
      if (productItems != null) {
        productItems = productItems.filter(i => i.itemId != action.productItem.itemId);
      }
      product.productItems = productItems;
      await this.productService.update(product);
      return productActions.deleteProductItemSuccess({productId: action.productId, productItems: productItems })

    }),
    catchError((error, caught) => {
      this.store.dispatch(productActions.deleteProductItemFail({error}));
      return caught;
    })
  ));

}


