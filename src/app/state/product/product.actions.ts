import { Product } from '@app/models/product';
import { ProductAddOn } from '@app/models/product-addon';
import { ProductItem } from '@app/models/product-item';
import { Update } from '@ngrx/entity';
import { createAction, props } from '@ngrx/store';

export const productActions = {
  loadProducts: createAction(
    '[Product] Load products',
    props<{ shopid: string }>()
  ),
  loadProductsSuccess: createAction(
    '[Product] Load products success',
    props<{ products: Product[] }>()
  ),
  loadProductsFail: createAction(
    '[Product] Load products fail',
    props<{ error: any }>()
  ),
  createProduct: createAction(
    '[Product] Create product',
    props<{ product: Product }>()
  ),
  createProductSuccess: createAction(
    '[Product] Create product success',
    props<{ product: Product }>()
  ),
  createProductFail: createAction(
    '[Product] Create product fail',
    props<{ error: any }>()
  ),
  updateProduct: createAction(
    '[Product] Update product',
    props<{ product: Product }>()
  ),
  updateProductSuccess: createAction(
    '[Product] Update product success',
    props<{ update: Update<Product> }>()
  ),
  updateProductFail: createAction(
    '[Product] Update product fail',
    props<{ error: any }>()
  ),
  upsertProductItem: createAction(
    '[Product] Upsert product item',
    props<{ productId: string, productItem: ProductItem}>()
  ),
  upsertProductItemSuccess: createAction(
    '[Product] Upsert product item success',
    props<{ productId: string, productItems: ProductItem[] }>()
  ),
  upsertProductItemFail: createAction(
    '[Product] Upsert product item fail',
    props<{ error: any }>()
  ),
  loadProductDetails: createAction(
    '[Product] Reload product details'
  ),
  deleteProductItem: createAction(
    '[Product] Product item delete',
    props<{ productId: string, productItem: ProductItem }>()
  ),
  deleteProductItemSuccess: createAction(
    '[Product] Product item delete',
    props<{ productId: string, productItems: ProductItem[] }>()
  ),
  deleteProductItemFail: createAction(
    '[Product] Product item delete',
    props<{ error: any }>()
  ),
  upsertProductAddon: createAction(
    '[Product] Upsert product addon',
    props<{ productId: string, productAddon: ProductAddOn}>()
  ),
  upsertProductAddonSuccess: createAction(
    '[Product] Upsert product addon success',
    props<{ productId: string, productAddons: ProductAddOn[] }>()
  ),
  upsertProductAddonFail: createAction(
    '[Product] Upsert product addon fail',
    props<{ error: any }>()
  ),
 
  deleteProductAddon: createAction(
    '[Product] Product addon delete',
    props<{ productId: string, productAddon: ProductAddOn }>()
  ),
  deleteProductAddonSuccess: createAction(
    '[Product] Product addon delete success',
    props<{ productId: string, productAddons: ProductAddOn[] }>()
  ),
  deleteProductAddonFail: createAction(
    '[Product] Product addon delete fail',
    props<{ error: any }>()
  ),

  uploadProductPhoto: createAction(
    '[Product] Product photo upload',
    props<{ productId: string, file: File}>()
  ),
  uploadProductPhotoSuccess: createAction(
    '[Product] Product photo upload success',
    props<{ productId: string, uploadFileUrl: string}>()
  ),
  uploadProductPhotoFail: createAction(
    '[Product] Product photo upload fail',
    props<{ error: any }>()
  ),

  deleteProductPhoto: createAction(
    '[Product] Product photo delete',
    props<{ productId: string, url:string}>()
  ),
  deleteProductPhotoSuccess: createAction(
    '[Product] Product photo delete success',
    props<{ productId: string }>()
  ),
  deleteProductPhotoFail: createAction(
    '[Product] Product photo delete fail',
    props<{ error: any }>()
  )

}