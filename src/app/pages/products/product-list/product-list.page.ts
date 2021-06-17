import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { Product } from '@app/models/product';
import { AppState } from '@app/state';
import { productActions } from '@app/state/product/product.actions';
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
  products$: Observable<Product[]>
  
  constructor(
    private store: Store<AppState>,
    private modalController: ModalController,
    private navController: NavController
  ) { 
    this.store.select(state =>state.shop.id)
      .subscribe((shopid) => this.shopid = shopid);
    this.products$ = this.store.select(state => 
      Object.entries(state.products.entities)
      .map(([id,product]) => product)
    )
  }

  ngOnInit() {
    this.store.dispatch(productActions.loadProducts({ shopid: this.shopid }))
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
