import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage
  },
  {
    path: 'alerts',
    loadChildren: () => import('./low-inventory-alerts/low-inventory-alerts.module').then( m => m.LowInventoryAlertsPageModule)
  },
  {
    path: 'report',
    loadChildren: () => import('./daily-report/daily-report.module').then( m => m.DailyReportPageModule)
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
