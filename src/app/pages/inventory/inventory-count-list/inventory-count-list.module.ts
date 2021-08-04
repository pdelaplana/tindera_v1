import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InventoryCountListPageRoutingModule } from './inventory-count-list-routing.module';

import { InventoryCountListPage } from './inventory-count-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InventoryCountListPageRoutingModule
  ],
  declarations: [InventoryCountListPage]
})
export class InventoryCountListPageModule {}
