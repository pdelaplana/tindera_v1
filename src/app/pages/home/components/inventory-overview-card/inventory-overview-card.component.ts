import { ThrowStmt } from '@angular/compiler';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ColorGenerator } from '@app/components/text-avatar/color-generator';
import { InventoryItem } from '@app/models/inventory-item';
import { UtilsService } from '@app/services/utils.service';
import { AppState } from '@app/state';
import { selectAllAndGroupInventory } from '@app/state/inventory/inventory.selectors';
import { ActionsSubject, Store } from '@ngrx/store';
import { Chart, registerables } from 'chart.js';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-inventory-overview-card',
  templateUrl: './inventory-overview-card.component.html',
  styleUrls: ['./inventory-overview-card.component.scss'],
})
export class InventoryOverviewCardComponent implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();

  @ViewChild('onhandInventoryChart') viewChart;

  chart: any;
  inventoryCategories: {description: string, onhandQty: number, inventoryItems: InventoryItem[]}[];

  selectedCategory: string = '';
  totalItems: number = 0;
  totalValue: number = 0;
  
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
    
  }

  initChart() {
    this.createChart();
    this.store.select(selectAllAndGroupInventory(null)).subscribe(groups =>{
      this.inventoryCategories = groups;
      this.totalItems = this.inventoryCategories.reduce((sum, current) => sum + Number(current.onhandQty), 0);
      this.inventoryCategories.forEach(category => {
        category.inventoryItems.forEach(item =>{
          this.totalValue += ((Number.isNaN(item.currentCount) ? 0 : item.currentCount) * (Number.isNaN(item.unitCost) ? 0 : item.unitCost));
        })
      })
      this.pushChartData(this.inventoryCategories);
    })
  }


  createChart() {    
    this.chart = new Chart(this.viewChart.nativeElement, {
      type: 'pie',
      data: {
        labels: [],
        datasets: []
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: false,
            text: 'Onhand Inventory'
          }
        }
      },
    });
  }

  pushChartData(inventoryCategories: { description:string, onhandQty:number, inventoryItems: InventoryItem[] } []){
    
    const createChartDataSet = (label: string, slices: string[], data: any[] ) =>{
      return {
        label: label,
        backgroundColor: slices.map(slice => this.colorGenerator.getColor(slice)),
        data: data
      }
    }

    this.chart.data.labels = [];
    this.chart.data.datasets = [];
    this.chart.update();

    const chartData = [];
    
    inventoryCategories.forEach(cat => {
      this.chart.data.labels.push(cat.description);
      //chartData.push(cat.inventoryItems.reduce((sum, current) => sum + Number(current.currentCount), 0));
      chartData.push(cat.onhandQty);
    })

    this.chart.data.datasets.push(
      createChartDataSet('Onhand', this.chart.data.labels, chartData)
    );
    
    this.chart.update();
  }




}
