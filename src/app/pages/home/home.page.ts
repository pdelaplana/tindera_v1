import { Component, OnInit, ViewChild } from '@angular/core';
import { InventoryItem } from '@app/models/inventory-item';
import { Order } from '@app/models/order';
import { OrderItem } from '@app/models/order-item';
import { AppState } from '@app/state';
import { selectInventoryForReorder } from '@app/state/inventory/inventory.selectors';
import { selectOrdersByPeriod } from '@app/state/orders/order.selectors';
import { Store } from '@ngrx/store';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { CurrencyPipe } from '@angular/common';
import { PaymentType } from '@app/models/payment-type';
import { NavController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  providers: [CurrencyPipe]
})
export class HomePage implements OnInit {

  @ViewChild('salesTrendChart') salesTrendChart;
  @ViewChild('salesByPaymentTypeCard') salesByPaymentTypeCard;
  //@ViewChild('topSellingProductsCard') topSellingProductsCard;
  @ViewChild('lowInventoryAlertsCard') lowInventoryAlertsCard;
  @ViewChild('salesByProductCategoryCard') salesByProductCategoryCard;

  currencyCode: string;
  paymentTypes: PaymentType[];

  name: string;
  productsSoldYesterday: number;
  amountProductsSoldYesteday: number;

  

  orders$: Observable<Order[]>;

  constructor(
    private store: Store<AppState>,
    private navController: NavController
  ) { 
  }

  ngOnInit() {
    this.store.select(state => state.auth.displayName).subscribe(name => {
      this.name = name.split(" ")[0];
    });
    this.store.select(state => state.shop)
      .subscribe((shop) => {
        this.currencyCode = shop.currencyCode;
        this.paymentTypes = shop.paymentTypes;
      })
    
    this.store.select(selectOrdersByPeriod('yesterday')).subscribe(orders => {
      this.amountProductsSoldYesteday = orders.reduce((sum, current) => sum + current.totalSale, 0);
      this.productsSoldYesterday = orders.reduce((sum, current) => sum + current.orderItems.length, 0);
    })
    
  }

  ionViewDidEnter() {
    this.salesTrendChart.initChart();
    this.salesTrendChart.filterByPeriod('last7Days');
    this.salesByPaymentTypeCard.filterByPeriod('last7Days');
    //this.topSellingProductsCard.filterByPeriod('last7Days');
    this.salesByProductCategoryCard.filterByPeriod('last7Days')
  }

  
  navigateToLowInventoryAlerts(){
    const navigationExtras: NavigationExtras = { state: {  } };
    this.navController.navigateForward('home/alerts', navigationExtras);
  }

  navigateToDailyReport(){
    const navigationExtras: NavigationExtras = { state: {  } };
    this.navController.navigateForward('home/report', navigationExtras);
  }


}
