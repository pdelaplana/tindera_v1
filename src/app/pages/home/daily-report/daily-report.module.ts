import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DailyReportPageRoutingModule } from './daily-report-routing.module';

import { DailyReportPage } from './daily-report.page';
import { SharedComponentsModule } from '@app/components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedComponentsModule,
    DailyReportPageRoutingModule
  ],
  declarations: [DailyReportPage]
})
export class DailyReportPageModule {}
