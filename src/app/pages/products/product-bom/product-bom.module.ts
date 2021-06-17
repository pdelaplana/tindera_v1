import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductBOMPageRoutingModule } from './product-bom-routing.module';

import { ProductBOMPage } from './product-bom.page';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicSelectableModule,
    IonicModule,
    ProductBOMPageRoutingModule
  ],
  declarations: [ProductBOMPage]
})
export class ProductBOMPageModule {}
