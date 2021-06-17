import { Product } from '@app/models/product';
import { EntityState } from '@ngrx/entity';

export interface ProductState extends EntityState<Product> { 
  selectedProductId : string | null;
}