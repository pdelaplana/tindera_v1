import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ColorGenerator } from '@app/components/text-avatar/color-generator';
import { InventoryItem } from '@app/models/inventory-item';
import { InventoryTransaction } from '@app/models/inventory-transaction';
import { UtilsService } from '@app/services/utils.service';
import { AppState } from '@app/state';
import { inventoryActions } from '@app/state/inventory/inventory.actions';
import { selectInventoryItems, selectInventoryTransactionsByDateRange } from '@app/state/inventory/inventory.selectors';
import { ofType } from '@ngrx/effects';
import { ActionsSubject, Store } from '@ngrx/store';
import { Chart, registerables } from 'chart.js';
import { Subscription } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-inventory-movement-card',
  templateUrl: './inventory-movement-card.component.html',
  styleUrls: ['./inventory-movement-card.component.scss'],
})
export class InventoryMovementCardComponent implements OnInit, OnDestroy {

  @ViewChild('inventoryMovementChart') viewChart;

  itemsToShow = 10;

  toDate: Date;
  fromDate: Date;
  chart: any;
  chartData: any[];
  items: any[];

  filterLabel = `This week`;
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
    this.subscription
      .add(
        this.actions.pipe(
          ofType(inventoryActions.loadTransactionsSuccess),
        ).subscribe(action => {

          this.store.select(selectInventoryTransactionsByDateRange(this.fromDate, this.toDate)).subscribe(transactions => {

            this.store.select(selectInventoryItems()).subscribe(items => {
              this.items = this.sumupTransactionsByItem(transactions, items)
                .sort((a,b)=>a.quantityOnhand >= b.quantityOnhand ? 1 : -1);
              this.pushChartData(this.items);
            });

          });

        })
      );
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
        maintainAspectRatio:true,
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

  pushChartData(items: any){

    const addOnHandBalance = (item: any, chartData: any[]) =>{
      const found = chartData.find(data => data.y === item.itemName);
      if (found !== undefined) {
        found.x += Number(item.quantityOnhand);
      }
      else {
        chartData.push({
          y : item.itemName,
          x : item.quantityOnhand
        });
      }

    };

    const addQuantityIn = (item: any, chartData: any[]) =>{
      const found = chartData.find(data => data.y === item.itemName);
      if (found !== undefined) {
        found.x += Number(item.quantityIn);
      }
      else {
        chartData.push({
          y : item.itemName,
          x : item.quantityIn
        });
      }
    };

    const addQuantityOut = (item: any, chartData: any[]) =>{
      const found = chartData.find(data => data.y === item.itemName);
      if (found !== undefined) {
        found.x -= Number(item.quantityOut);
      }
      else {
        chartData.push({
          y : item.itemName,
          x : -item.quantityOut
        });
      }
    };


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

    const quantityOnhandData = [];
    const quantityInData = [];
    const quantityOutData = [];

    items
      .forEach(item => {
        ///addOnHandBalance(item, quantityOnhandData);
        addQuantityIn(item, quantityInData);
        addQuantityOut(item, quantityOutData);
    });

    this.chart.data.labels = [];
    this.chart.data.datasets = [];
    this.chart.update();

    this.chart.data.datasets.push(
      createChartDataSet('In', this.colorGenerator.getColor('QuantityIn'), this.colorGenerator.getColor('QuantityIn'), quantityInData)
    );

    this.chart.data.datasets.push(
      createChartDataSet('Out', this.colorGenerator.getColor('QuantityOut'), this.colorGenerator.getColor('QuantityOut'), quantityOutData)
    );

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
    this.filterLabel = `Top ${this.itemsToShow} items moved`;
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

  private sumupTransactionsByItem(transactions: InventoryTransaction[], items: InventoryItem[]){
    return transactions
        .reduce((groups: { itemId: string; itemName: string; quantityIn: number; quantityOut: number; quantityOnhand: number}[],
            thisInventoryTransaction: InventoryTransaction) => {
          let found = groups.find(group => group.itemId === thisInventoryTransaction.itemId);
          if (found === undefined) {
            found = {
              itemId: thisInventoryTransaction.itemId,
              itemName: thisInventoryTransaction.itemName,
              quantityIn: thisInventoryTransaction.quantityIn,
              quantityOut: thisInventoryTransaction.quantityOut,
              quantityOnhand: items.find(inventory => inventory.id === thisInventoryTransaction.itemId).currentCount
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
