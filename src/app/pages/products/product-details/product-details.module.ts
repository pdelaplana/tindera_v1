import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductDetailsPageRoutingModule } from './product-details-routing.module';

import { ProductDetailsPage } from './product-details.page';
import { TagInputModule } from 'ngx-chips';

@NgModule({
  imports: [
    TagInputModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ProductDetailsPageRoutingModule
  ],
  declarations: [ProductDetailsPage]
})
export class ProductDetailsPageModule {}
