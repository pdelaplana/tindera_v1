import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductAddPageRoutingModule } from './product-add-routing.module';

import { ProductAddPage } from './product-add.page';
import { TagInputModule } from 'ngx-chips';



@NgModule({
  imports: [

    TagInputModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ProductAddPageRoutingModule
  ],
  declarations: [ProductAddPage]
})
export class ProductAddPageModule {}
