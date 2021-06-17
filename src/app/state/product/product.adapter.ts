import { Product } from '@app/models/product';
import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';

export const productAdapter : EntityAdapter<Product> = createEntityAdapter<Product>({ 
  selectId: (product: Product) => product.id,
  //sortComparer: function (a, b){  return a.name.localeCompare(b.name); }
});