import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductAddonPageRoutingModule } from './product-addon-routing.module';

import { ProductAddonPage } from './product-addon.page';
import { IonicSelectableModule } from 'ionic-selectable';
import { SharedComponentsModule } from '@app/components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicSelectableModule,
    SharedComponentsModule,
    IonicModule,
    ProductAddonPageRoutingModule
  ],
  declarations: [ProductAddonPage]
})
export class ProductAddonPageModule {}
