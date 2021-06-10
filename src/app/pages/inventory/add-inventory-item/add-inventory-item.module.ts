import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddInventoryItemPageRoutingModule } from './add-inventory-item-routing.module';

import { AddInventoryItemPage } from './add-inventory-item.page';
import { SharedComponentsModule } from '@app/components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SharedComponentsModule,
    AddInventoryItemPageRoutingModule
  ],
  declarations: [
    AddInventoryItemPage
  ]
})
export class AddInventoryItemPageModule {}
