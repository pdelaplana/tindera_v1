import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StoreSetupPageRoutingModule } from './store-setup-routing.module';

import { StoreSetupPage } from './store-setup.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    StoreSetupPageRoutingModule
  ],
  declarations: [StoreSetupPage]
})
export class StoreSetupPageModule {}
