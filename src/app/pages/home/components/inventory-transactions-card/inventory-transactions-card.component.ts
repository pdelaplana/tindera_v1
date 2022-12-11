import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ColorGenerator } from '@app/components/text-avatar/color-generator';
import { UtilsService } from '@app/services/utils.service';
import { AppState } from '@app/state';
import { ActionsSubject, Store } from '@ngrx/store';
import { Chart, registerables } from 'chart.js';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { InventoryTransaction } from '@app/models/inventory-transaction';
import { selectInventoryTransactionsByDateRange } from '@app/state/inventory/inventory.selectors';

@Component({
  selector: 'app-inventory-transactions-card',
  templateUrl: './inventory-transactions-card.component.html',
  styleUrls: ['./inventory-transactions-card.component.scss'],
})
export class InventoryTransactionsCardComponent implements OnInit, OnDestroy {


  @ViewChild('inventoryTransactionsChart') viewChart;

  itemsToShow = 10;

  toDate: Date;
  fromDate: Date;
  chart: any;
  chartData: any[];
  transactionGroups: { transactionType: string; quantityIn: number; quantityOut: number }[];

  filterLabel = 'Transactions this week';
  filterPeriod = 'thisWeek';

  private subscription: Subscription = new Subscription();

  constructor(
    private store: Store<AppState>,
    private actions: ActionsSubject,
    private utils: UtilsService,
    private colorGenerator: ColorGenerator
  ) {
    Chart.register(...registerables);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
    /*
    this.subscription
    .add(
      this.actions.pipe(
        ofType(inventoryActions.loadTransactionsSuccess),
      ).subscribe(action => {

        this.store.select(selectInventoryTransactionsByDateRange(this.fromDate, this.toDate)).subscribe(transactions => {

          this.transactionGroups = this.sumupTransactionsByType(transactions);
          this.pushChartData(this.transactionGroups);

        });

      })
    );
    */
  }

  initChart() {
    this.createChart();
  }

  createChart() {
    this.chart = new Chart(this.viewChart.nativeElement, {
      type: 'bar',
      data: {
        datasets: []
      },
      options:{
        indexAxis: 'y',
        responsive:true,
        maintainAspectRatio:false,
        plugins:{
          title:{
            display:false,
            text:'On Hand'
          },
          legend: {
            display:true,
            position:'top'
          },
          tooltip:{
          }
        },
        scales:{
          xAxes:{
            stacked:true,
            ticks:{
              autoSkip:false,
              padding:10,
            }
          },
          yAxes: {
            stacked:true,
            ticks:{
              autoSkip: false,
              stepSize:2,
              align:'start',
              callback(value,index) {
                const label = this.getLabelForValue(value);
                return label.length>12 ? label.substring(0,12) +'...' : label;
              },

            }
          }
        }
      }

    });
  }

  pushChartData(transactionGroups: { transactionType: string; quantityIn: number; quantityOut: number  }[]){

    const createChartDataSet = (label: string, color: string, backgroundColor: string, data: any[] ) =>({
        label,
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
        data
      });

    this.chart.data.labels = [];
    this.chart.data.datasets = [];
    this.chart.update();

    transactionGroups
      .forEach(transactionGroup => {

        this.chart.data.datasets.push(
          createChartDataSet(
            transactionGroup.transactionType,
            this.colorGenerator.getColor(transactionGroup.transactionType),
            this.colorGenerator.getColor(transactionGroup.transactionType),
            [{
              y : transactionGroup.transactionType,
              x : transactionGroup.quantityIn+transactionGroup.quantityOut
            }]
          )
        );

      });

    this.chart.update();
  }


  getData(fromDate: Date, toDate: Date){
    this.fromDate = moment(fromDate).startOf('day').toDate();
    this.toDate = moment(toDate).endOf('day').toDate();
    this.store.select(selectInventoryTransactionsByDateRange(this.fromDate, this.toDate)).subscribe(orders => {
      this.pushChartData(orders);
    });

  }

  togglePeriodFilter(period: string){
    if (this.filterPeriod === period)
      {return 'primary';}
    else
      {return '';}
  }

  filterByPeriod(period: string){
    this.filterPeriod = period;
    this.filterLabel = `Transactions`;
    switch (period){
      case 'thisWeek':
        this.filterLabel = `${this.filterLabel} this week`;
        break;
      case 'thisMonth':
        this.filterLabel = `${this.filterLabel} this month`;
        break;
      case 'thisQuarter':
        this.filterLabel = `${this.filterLabel} this quarter`;
        break;
      case 'thisYear':
        this.filterLabel = `${this.filterLabel} this year`;
        break;
    }

    const [start, end] = this.utils.getDatesfromPeriod(period);
    this.getData(start,end);

  }

  private sumupTransactionsByType(transactions: InventoryTransaction[]): {
    transactionType: string; quantityIn: number; quantityOut: number;
  }[]{
    return transactions
        .reduce((groups: { transactionType: string; quantityIn: number; quantityOut: number}[],
            thisInventoryTransaction: InventoryTransaction) => {
          let transactionType = '';
          if (thisInventoryTransaction.transactionType === 'adjustment'){
              transactionType = `${thisInventoryTransaction.adjustmentReason.description} (Adjustment)`;
          } else {
              transactionType = thisInventoryTransaction.transactionType;
              transactionType = transactionType[0].toUpperCase() + transactionType.slice(1).toLowerCase();
          }

          let found = groups.find(group => group.transactionType === transactionType);
          if (found === undefined) {
            found = {
              transactionType,
              quantityIn: 0,
              quantityOut: 0,
            };
            groups.push(found);
          }
          found.quantityIn += thisInventoryTransaction.quantityIn;
          found.quantityOut += thisInventoryTransaction.quantityOut;
          return groups;
        }, [])
        .slice(0, this.itemsToShow);
  }





}
