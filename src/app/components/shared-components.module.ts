import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyInputComponent } from './currency-input/currency-input.component';
import { FormsModule } from '@angular/forms';
import { CategoryLabelPipe } from '@app/pipes/category-label.pipe';
import { UomLabelPipe } from '@app/pipes/uom-label.pipe';
import { TransactionTypePipe } from '../pipes/transaction-type.pipe';



@NgModule({
  declarations: [
    CategoryLabelPipe,
    UomLabelPipe,
    TransactionTypePipe,
    CurrencyInputComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    CategoryLabelPipe,
    UomLabelPipe,
    TransactionTypePipe,
    CurrencyInputComponent
  ]
})
export class SharedComponentsModule { }
