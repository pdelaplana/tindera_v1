import { Component, OnInit, ViewChild } from '@angular/core';
import { Order } from '@app/models/order';
import { AppState } from '@app/state';
import { selectOrdersByPeriod } from '@app/state/orders/order.selectors';
import { Store } from '@ngrx/store';
import 'chartjs-adapter-date-fns';
import { Observable } from 'rxjs';
import { CurrencyPipe } from '@angular/common';
import { PaymentType } from '@app/models/payment-type';
import { NavController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  providers: [CurrencyPipe]
})
export class HomePage implements OnInit {

  @ViewChild('salesActivityCard') salesActivityCard;
  
  @ViewChild('salesTrendChart') salesTrendChart;
  @ViewChild('salesByPaymentTypeCard') salesByPaymentTypeCard;
  @ViewChild('topSellingProductsCard') topSellingProductsCard;
  @ViewChild('lowInventoryAlertsCard') lowInventoryAlertsCard;
  @ViewChild('salesByProductCategoryCard') salesByProductCategoryCard;
  @ViewChild('onhandInventoryLevelsChart') onhandInventoryLevelsChart;
  @ViewChild('inventoryMovementChart') inventoryMovementChart;
  @ViewChild('onhandInventoryChart') onhandInventoryChart;
  @ViewChild('inventoryTransactionsCard') inventoryTransactionsCard;
  
  currencyCode: string;
  paymentTypes: PaymentType[];

  name: string;
  productsSoldYesterday: number;
  amountProductsSoldYesteday: number;

  enabledCharts = [
    'salesActivityCard',
    'salesTrendChart',
    //'salesByPaymentTypeCard',
    //'topSellingProductsCard',
    'lowInventoryAlertsCard',
    //'salesByProductCategoryCard',
    'onhandInventoryLevelsChart',
    'inventoryMovementChart',
    'onhandInventoryChart',
    'inventoryTransactionsCard'
  ];

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
    if (this.enabledCharts.includes('salesActivityCard')) {
      this.salesActivityCard.initChart();
    }
    
    if (this.enabledCharts.includes('salesTrendChart')) {
      this.salesTrendChart.initChart();
      this.salesTrendChart.filterByPeriod('thisWeek');
    }

    if (this.enabledCharts.includes('onhandInventoryLevelsChart')){
      this.onhandInventoryLevelsChart.initChart();
      this.onhandInventoryLevelsChart.filterByPeriod('thisWeek');  
    }
    
    if (this.enabledCharts.includes('inventoryMovementChart')){
      this.inventoryMovementChart.initChart();
      this.inventoryMovementChart.filterByPeriod('thisWeek');
    }

    if (this.enabledCharts.includes('onhandInventoryChart')){
      this.onhandInventoryChart.initChart();
    }

    if (this.enabledCharts.includes('inventoryTransactionsCard')){
      this.inventoryTransactionsCard.initChart();
    }
    
    if (this.enabledCharts.includes('salesByPaymentTypeCard')){
      this.salesByPaymentTypeCard.filterByPeriod('thisWeek');
    }
    
    if (this.enabledCharts.includes('topSellingProductsCard')){
      this.topSellingProductsCard.filterByPeriod('last7Days');
    }

    if (this.enabledCharts.includes('salesByProductCategoryCard')){
      this.salesByProductCategoryCard.filterByPeriod('thisWeek');  
    }
    
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
