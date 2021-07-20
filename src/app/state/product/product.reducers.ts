import { Action, createReducer, on } from '@ngrx/store';
import { productActions } from './product.actions';
import { productAdapter } from './product.adapter';
import { ProductState } from './product.state';

const initialProductState: ProductState =  productAdapter.getInitialState({ selectedProductId: null});

const reducer = createReducer(
  initialProductState,
  on(productActions.createProductSuccess, (state, { product }) => {
    return productAdapter.addOne(product, state);
  }),
  on(productActions.updateProductSuccess, (state, { update }) => {
    return productAdapter.updateOne(update, state);
  }),
  on(productActions.loadProductsSuccess, (state, { products }) => {
    return productAdapter.upsertMany(products, state)
  }),
  on(productActions.upsertProductItemSuccess, (state, { productId, productItems }) => {
    return productAdapter.updateOne({ id: productId, changes: { productItems: productItems }}, state)
  }),
  on(productActions.deleteProductItemSuccess, (state, { productId, productItems }) => {
    return productAdapter.updateOne({ id: productId, changes: { productItems: productItems }}, state)
  }),
  on(productActions.upsertProductAddonSuccess, (state, { productId, productAddons }) => {
    return productAdapter.updateOne({ id: productId, changes: { productAddOns: productAddons }}, state)
  }),
  on(productActions.deleteProductAddonSuccess, (state, { productId, productAddons }) => {
    return productAdapter.updateOne({ id: productId, changes: { productAddOns: productAddons }}, state)
  }),
  on(productActions.uploadProductPhotoSuccess, (state, { productId, uploadFileUrl }) => {
    return productAdapter.updateOne({ id: productId, changes: { imageUrl: uploadFileUrl }}, state)
  }),
  on(productActions.deleteProductPhotoSuccess, (state, { productId }) => {
    return productAdapter.updateOne({ id: productId, changes: { imageUrl: null }}, state)
  }),
  
)

export function productReducer(state: ProductState | undefined, action: Action) {
  return reducer(state, action);
}