import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoryLabelPipe } from '@app/pipes/category-label.pipe';
import { UomLabelPipe } from '@app/pipes/uom-label.pipe';
import { TransactionTypePipe } from './pipes/transaction-type.pipe';
import { IonicModule } from '@ionic/angular';
import { ShopCurrencyPipe } from './pipes/shop-currency.pipe';
import { CurrencyInputComponent } from './currency-input/currency-input.component';



@NgModule({
  declarations: [
    CurrencyInputComponent,
    CategoryLabelPipe,
    UomLabelPipe,
    TransactionTypePipe,
    ShopCurrencyPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule
  ],
  exports: [
    CurrencyInputComponent,
    CategoryLabelPipe,
    UomLabelPipe,
    TransactionTypePipe,
    ShopCurrencyPipe
  ]
})
export class SharedComponentsModule { }
