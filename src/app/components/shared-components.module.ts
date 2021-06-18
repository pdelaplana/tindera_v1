import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryLabelPipe } from '@app/pipes/category-label.pipe';
import { UomLabelPipe } from '@app/pipes/uom-label.pipe';
import { TransactionTypePipe } from '../pipes/transaction-type.pipe';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [
    CategoryLabelPipe,
    UomLabelPipe,
    TransactionTypePipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  exports: [
    CategoryLabelPipe,
    UomLabelPipe,
    TransactionTypePipe
  ]
})
export class SharedComponentsModule { }
