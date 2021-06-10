import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyInputComponent } from './currency-input/currency-input.component';
import { FormsModule } from '@angular/forms';
import { CategoryLabelPipe } from '@app/pipes/category-label.pipe';
import { UomLabelPipe } from '@app/pipes/uom-label.pipe';



@NgModule({
  declarations: [
    CategoryLabelPipe,
    UomLabelPipe,
    CurrencyInputComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    CategoryLabelPipe,
    UomLabelPipe,
    CurrencyInputComponent
  ]
})
export class SharedComponentsModule { }
