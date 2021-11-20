import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InventoryCountStartDialogPageRoutingModule } from './inventory-count-start-dialog-routing.module';

import { InventoryCountStartDialogPage } from './inventory-count-start-dialog.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    InventoryCountStartDialogPageRoutingModule
  ],
  declarations: [InventoryCountStartDialogPage]
})
export class InventoryCountStartDialogPageModule {}
