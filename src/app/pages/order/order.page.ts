import { Component, OnInit } from '@angular/core';
import { CommonUIService } from '@app/services/common-ui.service';
import { ModalController, NavController } from '@ionic/angular';
import { MenuItem } from 'src/app/models/menu-item';
import { OrderProductPage } from '../order-product/order-product.page';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit {

  menuItems : MenuItem[] = [
    <MenuItem>{
      name: 'Tempura Bucket (12pcs)',
      price:20.00,
    },
    <MenuItem>{
      name: 'Kani Tempura',
      price:20.00,
    },
    <MenuItem>{
      name: 'Imperial Mix'
    },
    <MenuItem>{
      name: 'Hotto Tempura'
    },
    <MenuItem>{
      name: 'Chili Cheese Tempura (5pcs)'
    },
    
  ]

  constructor(
    private modalController: ModalController,
    private navController: NavController,
    private commonUIService: CommonUIService
  ) { }

  ngOnInit() {
  }

  async orderProduct(){
    const modal = await this.modalController.create({
      component: OrderProductPage,
      //cssClass: 'small-modal',
      componentProps: {
        //month: moment(this.spendingPeriod).format('M'),
        //year: moment(this.spendingPeriod).format('YYYY')
      }
    });
   
    return await modal.present();
  }

  navigateToCart(){
    this.navController.navigateForward('order/cart');
  }

  navigateToItem(){
    this.navController.navigateForward('order/item');
  }

}
