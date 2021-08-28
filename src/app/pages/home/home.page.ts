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

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  providers: [CurrencyPipe]
})
export class HomePage implements OnInit {

  @ViewChild('chart') chart;

  currencyCode: string;
  paymentTypes: PaymentType[];
  
  showSalesSummary: boolean = true;
  salesByPaymentType: any;
  topSellingProducts: any[] = [];

  orders$: Observable<Order[]>;
  items: InventoryItem[];

  filterLabel = 'This week';
  filterPeriod = 'thisWeek';

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
      /*
      .reduce((groups: { paymentType: string, totalSale: number,  orders: Order[]}[], thisOrder:  Order) => {
        let thisPaymentType = thisOrder.paymentType.description;
        if (thisPaymentType == null) thisPaymentType = 'None';
        let found = groups.find(group => group.paymentType === thisPaymentType);
        if (found === undefined) {
          found = { paymentType: thisPaymentType, totalSale: 0, orders: [] };
          groups.push(found);
        }
        found.totalSale += Number(thisOrder.totalSale);
        found.orders.push(thisOrder);
        return groups;
      }, [])
      */
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
      case 'thisWeek':
        startDate = moment().subtract(1, 'week').add(1,'day');
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

    const chartData = []
    const endDate = moment();

    let currentDate = startDate;
    
    while (currentDate <= endDate){
      chartData.push({x: moment(currentDate).format(formatLabel), y:0 })
      currentDate.add(1, 'day')
    }

    orders
      .sort((a: Order, b: Order) => {
        const dateA = a.orderDate !== null ? a.orderDate.toDate().getTime() : 0;
        const dateB = b.orderDate !== null ? b.orderDate.toDate().getTime() : 0;
        return dateB - dateA;
      })
      .forEach(order => {
        const thisLabel = moment(order.orderDate.toDate()).format(formatLabel);
        let found = chartData.find(data => data.x === thisLabel);
        if (found !== undefined) {
          found.y += Number(order.totalSale);
        }
      
    })

    this.chart.data.labels = [];
    this.chart.data.datasets = [];
    this.chart.update();

    this.chart.data.datasets = [{
      label: 'Amount Sold',
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
    }];

    this.chart.update();
  }

  createSalesTrendChart() {    
    this.chart = new Chart(this.chart.nativeElement, {
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
    private currencyPipe: CurrencyPipe
  ) { 
    Chart.register(...registerables);
    
  }

  ngOnInit() {
    this.store.select(state => state.shop)
      .subscribe((shop) => {
        this.currencyCode = shop.currencyCode;
        this.paymentTypes = shop.paymentTypes;
      })
    this.store.select(selectInventoryForReorder()).subscribe(items => {
      this.items = items.slice(0,5);
    });
    
  }

  ionViewDidEnter() {
    this.createSalesTrendChart();
    this.filterByPeriod('thisWeek');
    /*
    this.store.select(selectOrdersByPeriod('thisWeek'))
      .pipe(take(1))
      .subscribe(orders =>{
        this.pushData(orders, 'thisWeek');
      })
    */
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
      case 'thisWeek':
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


}
