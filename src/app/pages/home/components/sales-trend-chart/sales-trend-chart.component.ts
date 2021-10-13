import { CurrencyPipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Order } from '@app/models/order';
import { PaymentType } from '@app/models/payment-type';
import { AppState } from '@app/state';
import { selectOrdersByPeriod } from '@app/state/orders/order.selectors';
import { Store } from '@ngrx/store';
import { Chart, registerables } from 'chart.js';
import * as moment from 'moment';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sales-trend-chart',
  templateUrl: './sales-trend-chart.component.html',
  styleUrls: ['./sales-trend-chart.component.scss'],
})
export class SalesTrendChartComponent implements OnInit {

  @ViewChild('salesTrendChart') viewChart;

  chart:any;
  filterLabel = 'This week';
  filterPeriod = 'last7Days';

  orders$: Observable<Order[]>;

  currencyCode: string;
  paymentTypes: PaymentType[];

  constructor(
    private store: Store<AppState>,
    private currencyPipe: CurrencyPipe,
  ) { 
    Chart.register(...registerables);
  }

  ngOnInit() {
   
    this.store.select(state => state.shop)
      .subscribe((shop) => {
        this.currencyCode = shop.currencyCode;
        this.paymentTypes = shop.paymentTypes;
      })
      
  }

  initChart() {
    this.createSalesTrendChart();
  }

  pushChartData(orders: Order[], period: string){
    
    const chartDataByPaymentType = (order: Order, paymentType: string, dataLabel: string, chartData: any[]) =>{
       if (paymentType == 'Total' || order.paymentType.code == paymentType){
        let found = chartData.find(data => data.x === dataLabel);
        if (found !== undefined) {
          found.y += Number(order.totalSale);
        }
      }
    }

    const createChartDataSet = (label: string, color: string, backgroundColor: string, data: any[] ) =>{
      return {
        label: label,
        fill: false,
        lineTension: 0.5,
        backgroundColor: backgroundColor ?? color,
        borderColor: color,
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: color,
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: color,
        pointHoverBorderColor: color,
        pointHoverBorderWidth: 2,
        pointRadius: 2,
        pointHitRadius: 10,
        spanGaps: true,
        data: data
      }
    }

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

        chartDataByPaymentType(order, 'Total', thisLabel, chartData);
        chartDataByPaymentType(order, 'CASH', thisLabel, cashSalesData);
        chartDataByPaymentType(order, 'PANDA', thisLabel, foodPandaSalesData);
        chartDataByPaymentType(order, 'GRAB', thisLabel, grabFoodSalesData);
        
    })

    this.chart.data.labels = [];
    this.chart.data.datasets = [];
    this.chart.update();

    this.chart.data.datasets.push(
      createChartDataSet('Total', 'rgba(75,192,192,1)', 'rgba(75,192,192,.5)', chartData)
    );
    this.chart.data.datasets.push(
      createChartDataSet('Cash', 'rgba(103, 58, 183,1)', 'rgba(103, 58, 183, .5)', cashSalesData )
    );
    this.chart.data.datasets.push(
      createChartDataSet('FoodPanda', 'rgba(129, 199, 132,1)',  'rgba(129, 199, 132, .5)', foodPandaSalesData )
    );
    this.chart.data.datasets.push(
      createChartDataSet('GrabFood', 'rgba(144, 164, 174, 1)', 'rgba(144, 164, 174, .5)', grabFoodSalesData )
    );
    
    
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
          legend: {
            position: 'top',
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
      
      this.pushChartData(orders, period);
    });
 
  }


}
