import { Product } from '@app/models/product';
import { createSelector } from '@ngrx/store';
import { AppState } from '..';


const groupByCategory = (array:Product[]): { category: string, products: Product[]}[] => {
  return array
    .sort((a: Product, b: Product) => {
      return a.productCategory?.sequence > b.productCategory?.sequence ? 1 : -1;
    })
    .reduce((groups: { category: string, products: Product[]}[], thisProduct: Product) => {
      let thisCategory = thisProduct.productCategory?.description;
      if (thisCategory == null) thisCategory = 'Others';
      let found = groups.find(group => group.category === thisCategory);
      if (found === undefined) {
        found = { category: thisCategory, products: [] };
        groups.push(found);
      }
      found.products.push(thisProduct);
      return groups;
    }, [])
}

export const selectProductState = (state: AppState) => state.products;

export const selectAllProducts = () => 
  createSelector(
    selectProductState,
    state => 
      Object.entries(state.entities).map(([id,product]) => product)
  );



  export const selectAllAndGroupProducts = (searchTerm: string) => 
  createSelector(
    selectProductState,
    state => {
      let products = Object.entries(state.entities).map(([id,product]) => product)
      if (searchTerm)
        products = products.filter(product => product.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 )
      return groupByCategory(products);
    }
        
  );

export const selectProduct = ( id: string) => 
  createSelector(
    selectProductState, 
    (state) => state.entities[id]
  );

  