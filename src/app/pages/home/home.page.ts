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

  @ViewChild('chart') viewChart;

  chart:any;

  currencyCode: string;
  paymentTypes: PaymentType[];

  name: string;
  productsSoldYesterday: number;
  amountProductsSoldYesteday: number;
  
  salesByPaymentType: any;
  topSellingProducts: any[] = [];
  itemsForReorder: InventoryItem[];


  orders$: Observable<Order[]>;

  filterLabel = 'This week';
  filterPeriod = 'last7Days';

  private getSalesByPaymentType(orders:Order[]): { paymentType: string,  totalSale: number, orders: Order[]}[] {
    const paymentTypes = [];
    this.paymentTypes.forEach(paymentType => 
      paymentTypes.push({ code: paymentType.code, description: paymentType.description, totalSale: 0 }));

    orders
      .sort((a: Order, b: Order) => {
        return a.paymentType?.code > b.paymentType?.code ? 1 : -1;
      })
      .forEach(order =>{
        let found = paymentTypes.find(paymentType => paymentType.description == order.paymentType.description);
        if (found){
          found.totalSale += Number(order.totalSale);
        }
      })
      return paymentTypes;
  }

  private getTopSellingProducts(orders: Order[]){
    const items = orders.map(p =>p.orderItems);
    return items
        .reduce((a,b,) => [...a, ...b], [])
        .sort((a: OrderItem, b: OrderItem) => {
          return a.productName > b.productName ? 1 : -1;
        })
        .reduce((groups: { productName: string, totalSale: number, totalQuantity: number,  orderItems: OrderItem[]}[], thisOrderItem: OrderItem) => {
          let thisProductName = thisOrderItem.productName;
          if (thisProductName == null) thisProductName = 'None';
          let found = groups.find(group => group.productName === thisProductName);
          if (found === undefined) {
            found = {productName: thisProductName, totalSale: 0, totalQuantity: 0,  orderItems:[] };
            groups.push(found);
          }
          found.totalSale += Number(thisOrderItem.productUnitPrice) * Number(thisOrderItem.quantity);
          found.totalQuantity += Number(thisOrderItem.quantity);
          found.orderItems.push(thisOrderItem);
          return groups;
        }, [{ productName: '-', totalSale:0, totalQuantity: 0, orderItems:[]}])
        .sort((a,b) => {
          return a.totalQuantity < b.totalQuantity ? 1 : -1;
        })
        .slice(0,5)
  }

  
  pushChartData(orders: Order[], period: string){
    
    let startDate: moment.Moment;
    let label = '';
    let formatLabel: string;

    switch (period){
      case 'last7Days':
        startDate = moment().add(1,'day').subtract(7, 'day');
        formatLabel = 'dd';
        label = 'This week'
        break;
      case 'thisMonth':
        startDate = moment().subtract(1, 'month');
        formatLabel = 'DD MMM';
        label = 'This month'
        break;
      case 'last3Months':
        startDate = moment().subtract(3, 'month');
        formatLabel = 'DD MMM';
        label = 'Last 3 months';
        break;
      case 'last6Months':
        startDate = moment().subtract(6, 'month');
        formatLabel = 'DD MMM';
        label = 'Last 6 months';
        break;
      case 'thisYear':
        startDate = moment().subtract(1, 'year').add(1, 'month');
        label = 'This year';
        formatLabel = 'MMM';
        break;
    }

    const chartData = [];
    const cashSalesData = [];
    const foodPandaSalesData = [];
    const grabFoodSalesData = [];
    
    const endDate = moment();

    let currentDate = startDate;
    
    while (currentDate <= endDate){
      chartData.push({x: moment(currentDate).format(formatLabel), y:0 });
      cashSalesData.push({x: moment(currentDate).format(formatLabel), y:0 });
      foodPandaSalesData.push({x: moment(currentDate).format(formatLabel), y:0 });
      grabFoodSalesData.push({x: moment(currentDate).format(formatLabel), y:0 });
      
      currentDate.add(1, 'day')
    }

    orders
      .sort((a: Order, b: Order) => {
        const dateA = a.orderDate !== null ? a.orderDate.toDate().getTime() : 0;
        const dateB = b.orderDate !== null ? b.orderDate.toDate().getTime() : 0;
        return dateA - dateB;
      })
      .forEach(order => {
        const thisLabel = moment(order.orderDate.toDate()).format(formatLabel);
        let found = chartData.find(data => data.x === thisLabel);
        if (found !== undefined) {
          found.y += Number(order.totalSale);
        }

        // cash sales data
        if (order.paymentType.code == 'CASH'){
          found = cashSalesData.find(data => data.x === thisLabel);
          if (found !== undefined) {
            found.y += Number(order.totalSale);
          }
        }
        
        // food panda sales data
        if (order.paymentType.code == 'PANDA'){
          found = foodPandaSalesData.find(data => data.x === thisLabel);
          if (found !== undefined) {
            found.y += Number(order.totalSale);
          }
        }
        // grab food sales data
        if (order.paymentType.code == 'GRAB'){
          found = grabFoodSalesData.find(data => data.x === thisLabel);
          if (found !== undefined) {
            found.y += Number(order.totalSale);
          }
        }
    })

    this.chart.data.labels = [];
    this.chart.data.datasets = [];
    this.chart.update();

    this.chart.data.datasets = [{
      label: 'Total',
      fill: true,
      lineTension: 0.5,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      spanGaps: true,
      data: chartData
    },
    {
      label: 'Cash',
      fill: true,
      lineTension: 0.5,
      backgroundColor: 'rgba(103, 58, 183,1)',
      borderColor: 'rgba(103, 58, 183, 1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      spanGaps: true,
      data: cashSalesData
    },
    {
      label: 'FoodPanda',
      fill: true,
      lineTension: 0.5,
      backgroundColor: 'rgba(129, 199, 132,1)',
      borderColor: 'rgba(129, 199, 132,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      spanGaps: true,
      data: foodPandaSalesData
    },
    {
      label: 'GrabFood',
      fill: true,
      lineTension: 0.5,
      backgroundColor: 'rgba(144, 164, 174,1)',
      borderColor: 'rgba(144, 164, 174, 1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      spanGaps: true,
      data: grabFoodSalesData
    }
  ];

    this.chart.update();
  }

  createSalesTrendChart() {    
    this.chart = new Chart(this.viewChart.nativeElement, {
      type: 'line',
      data: {
        datasets: []
      },
      options:{
        responsive:true,
        maintainAspectRatio:false,
        plugins:{
          title:{
            display:false,
            text:'Sales'
          },
          tooltip:{
            callbacks:{
              label: (context) =>{
                var label = context.dataset.label || '';
                if (label) {
                    label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += this.currencyPipe.transform(context.parsed.y, this.currencyCode);
                }
                return label;
              }
            }
          }
        },
        scales:{
          yAxes: {
            ticks:{
              callback: (value, index, values) => {
                return this.currencyPipe.transform(value, this.currencyCode);
              }
            }
          }
        } 
      }
     
    });
  }

  constructor(
    private store: Store<AppState>,
    private currencyPipe: CurrencyPipe,
    private navController: NavController
  ) { 
    Chart.register(...registerables);
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
    this.store.select(selectInventoryForReorder()).subscribe(items => {
      this.itemsForReorder = items.slice(0,5);
    });
    this.store.select(selectOrdersByPeriod('yesterday')).subscribe(orders => {
      this.amountProductsSoldYesteday = orders.reduce((sum, current) => sum + current.totalSale, 0);
      this.productsSoldYesterday = orders.reduce((sum, current) => sum + current.orderItems.length, 0);
    })
    
  }

  ionViewDidEnter() {
    this.createSalesTrendChart();
    this.filterByPeriod('last7Days');
  }

  togglePeriodFilter(period: string){
    if (this.filterPeriod == period)
      return 'primary';
    else
      return '';
  }

  filterByPeriod(period: string){
    this.filterPeriod = period;

    switch (period){
      case 'last7Days':
        this.filterLabel = 'This week'
        break;
      case 'thisMonth':
        this.filterLabel = 'This month'
        break;
      case 'last3Months':
        this.filterLabel = 'Last 3 months';
        break;
      case 'last6Months':
        this.filterLabel = 'Last 6 months';
        break;
      case 'thisYear':
        this.filterLabel = 'This year';
        break;
    }

    this.orders$ = this.store.select(selectOrdersByPeriod(period)); 
    
    this.orders$.subscribe(orders => {
      this.salesByPaymentType = this.getSalesByPaymentType(orders);
      this.topSellingProducts = this.getTopSellingProducts(orders);
      this.pushChartData(orders, period);
    });
 
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
