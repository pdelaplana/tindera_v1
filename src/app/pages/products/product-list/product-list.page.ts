import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { Product } from '@app/models/product';
import { AppState } from '@app/state';
import { selectAllAndGroupProducts } from '@app/state/product/product.selectors';
import { ModalController, NavController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ProductAddPage } from '../product-add/product-add.page';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.page.html',
  styleUrls: ['./product-list.page.scss'],
})
export class ProductListPage implements OnInit {
  private shopid: string;
  products$: Observable<any>;
  
  private groupByCategory(array:Product[]): { category: string, products: Product[]}[] {
    return array
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
      }, []);
  }

  constructor(
    private store: Store<AppState>,
    private modalController: ModalController,
    private navController: NavController
  ) { 
    this.store.select(state =>state.shop.id)
      .subscribe((shopid) => this.shopid = shopid);
    this.products$ = this.store.select(selectAllAndGroupProducts(null));
  }

  ngOnInit() {
    //this.store.dispatch(productActions.loadProducts({ shopid: this.shopid }))
  }

  searchFor(event: any){
    const queryTerm = event.srcElement.value;
    this.products$ = this.store.select(selectAllAndGroupProducts(queryTerm));
  }
  
  async addNewProduct(){
    const modal = await this.modalController.create({
      component: ProductAddPage,
      componentProps: {
        
      }
    });
   
    return await modal.present();
  }

  navigateToDetails(productId: string){
    const navigationExtras: NavigationExtras = { state: { productId } };
    this.navController.navigateForward('products/details', navigationExtras);
  }


}
