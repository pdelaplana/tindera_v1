import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AppState } from '@app/state';
import { inventoryActions } from '@app/state/inventory/inventory.actions';
import { orderActions } from '@app/state/orders/order.actions';
import { ActionsSubject, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { ofType } from '@ngrx/effects';
import { selectInventoryTransactionsByDateRange } from '@app/state/inventory/inventory.selectors';
import { groupOrdersByPaymentType, groupOrdersByProductCategory, selectOrdersByDateRange } from '@app/state/orders/order.selectors';
import { UtilsService } from '@app/services/utils.service';
import { Chart, registerables } from 'chart.js';
import { ColorGenerator } from '@app/components/text-avatar/color-generator';
import { CurrencyPipe } from '@angular/common';
import { Order } from '@app/models/order';


@Component({
  selector: 'app-sales-activity-card',
  templateUrl: './sales-activity-card.component.html',
  styleUrls: ['./sales-activity-card.component.scss'],
})
export class SalesActivityCardComponent implements OnInit, OnDestroy {

  @ViewChild('salesActivityChart') viewChart;

  toDate: Date;
  fromDate: Date;

  chart: any;
  chartKind = 'categories';

  currencyCode: string;
  orders: Order[];
  totalOrders: number;
  totalSalesAmount: number;
  totalProductCost: number;
  totalRevenue: number;

  totalSpoilage: number;

  filterLabel = 'Today';
  filterPeriod = 'today';

  hasChartData= false;

  private subscription: Subscription = new Subscription();


  constructor(
    private store: Store<AppState>,
    private actions: ActionsSubject,
    private utils: UtilsService,
    private colorGenerator: ColorGenerator,
    private currencyPipe: CurrencyPipe,
  ) {
    Chart.register(...registerables);
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
    this.store.select(state => state.shop)
      .subscribe((shop) => {
        this.currencyCode = shop.currencyCode;
      });

    this.subscription
      .add(
        this.actions.pipe(
          ofType(inventoryActions.loadTransactionsSuccess),
        ).subscribe(action =>{
          this.store.select(selectInventoryTransactionsByDateRange(this.fromDate, this.toDate)).subscribe(transactions => {
            this.totalProductCost = transactions.filter(transaction => transaction.transactionType === 'sale')
              .reduce((sum, current) => sum + current.unitCost, 0 );
            this.totalRevenue = this.totalSalesAmount - this.totalProductCost;

            this.totalSpoilage = transactions
              .filter(transaction => transaction.transactionType === 'adjustment' && transaction.adjustmentReason.code === 'SPOILAGE')
              .reduce((sum, current) => sum + current.unitCost, 0 );

          });
        })
      )
      .add(
        this.actions.pipe(
          ofType(orderActions.loadOrdersSuccess),
        ).subscribe(action =>{
          this.store.select(selectOrdersByDateRange(this.fromDate, this.toDate)).subscribe(orders => {
            this.orders = orders;
            this.totalOrders = orders.length;
            this.totalSalesAmount = orders.reduce((sum, current) => sum + current.totalSale, 0);
            this.totalRevenue = this.totalSalesAmount - this.totalProductCost;
            this.refreshChart();

          });
        })
      );


      this.filterPeriod = 'today';
      this.filterByPeriod();

  }

  togglePeriodFilter(period: string){
    if (this.filterPeriod === period)
      {return 'primary';}
    else
      {return '';}
  }

  filterByPeriod(){
    const period = this.filterPeriod;

    switch (period){
      case 'yesterday':
        this.filterLabel = 'Yesterday';
        break;
      case 'today':
        this.filterLabel = 'Today';
        break;
      case 'thisWeek':
        this.filterLabel = 'This week';
        break;
      case 'thisMonth':
        this.filterLabel = 'This month';
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

    const [start, end] = this.utils.getDatesfromPeriod(period);
    this.getData(start,end);

  }

  getData(fromDate: Date, toDate: Date){
    this.fromDate = moment(fromDate).startOf('day').toDate();
    this.toDate = moment(toDate).endOf('day').toDate();

    this.store.select(selectOrdersByDateRange(this.fromDate, this.toDate)).subscribe(orders => {
      this.orders = orders;
      this.totalOrders = orders.length;
      this.totalSalesAmount = orders.reduce((sum, current) => sum + current.totalSale, 0);
      this.totalRevenue = this.totalSalesAmount - this.totalProductCost;
      this.refreshChart();

    });

  }

  initChart() {
    this.createChart();
  }


  createChart() {
    this.chart = new Chart(this.viewChart.nativeElement, {
      type: 'doughnut',
      data: {
        labels: [],
        datasets: []
      },
      options: {
        responsive: true,
        maintainAspectRatio:false,
        plugins: {
          tooltip:{
            callbacks: {
              label: (context) => {
                let label = context.label ?? '';
                if (context.parsed !== null) {
                      label += `: ${this.currencyPipe.transform (context.parsed, this.currencyCode)}`;
                }
                 return label;
              }
            }
          },
          legend: {
            position: 'right',
          },
          title: {
            display: false,
            text: 'Sales by Category'
          },

        },
        animation:{
          onProgress: (animation) =>{
            this.hasChartData = true;
          },
          onComplete: (animation)=>{
            this.hasChartData = (animation.chart.data.datasets.length > 0)  && (animation.chart.data.datasets[0].data.length >0);
          }
        }
      },

    });
  }

  pushChartData(datasets: { description: string; value: number }[]){

    const createChartDataSet = (label: string, slices: string[], data: any[] ) => ({
        label,
        backgroundColor: slices.map(slice => this.colorGenerator.getColor(slice)),
        data
      });

    this.chart.data.labels = [];
    this.chart.data.datasets = [];
    this.chart.update();

    const chartData = [];

    datasets.forEach(group => {
      this.chart.data.labels.push(group.description);
      chartData.push(group.value);
    });

    this.chart.data.datasets.push(
      createChartDataSet('Sales', this.chart.data.labels, chartData)
    );

    this.chart.update();

  }

  refreshChart(){
    if  (this.chartKind === 'categories'){
      this.pushChartData(
        groupOrdersByProductCategory(this.orders).map(group => ({ description: group.productCategory, value: group.totalSale }))
      );

    }
    else if (this.chartKind === 'payment'){
      this.pushChartData(
        groupOrdersByPaymentType(this.orders).map(group => ({ description: group.paymentType, value: group.totalSale }))
      );

    }
  }

  chartKindChange(event: any){
    this.chartKind = event.detail.value;
    this.refreshChart();
  }


}
