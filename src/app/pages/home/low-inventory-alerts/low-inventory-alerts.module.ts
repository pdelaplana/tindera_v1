import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LowInventoryAlertsPageRoutingModule } from './low-inventory-alerts-routing.module';

import { LowInventoryAlertsPage } from './low-inventory-alerts.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LowInventoryAlertsPageRoutingModule
  ],
  declarations: [LowInventoryAlertsPage]
})
export class LowInventoryAlertsPageModule {}
