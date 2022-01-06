import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoryLabelPipe } from '@app/pipes/category-label.pipe';
import { UomLabelPipe } from '@app/pipes/uom-label.pipe';
import { TransactionTypePipe } from './pipes/transaction-type.pipe';
import { IonicModule } from '@ionic/angular';
import { ShopCurrencyPipe } from './pipes/shop-currency.pipe';
import { CurrencyInputComponent } from './currency-input/currency-input.component';
import { PaymentTypeBadgeComponent } from './payment-type-badge/payment-type-badge.component';
import { TextAvatarComponent } from './text-avatar/text-avatar.component';
import { IconAvatarComponent } from './icon-avatar/icon-avatar.component';



@NgModule({
  declarations: [
    CurrencyInputComponent,
    PaymentTypeBadgeComponent,
    CategoryLabelPipe,
    UomLabelPipe,
    TransactionTypePipe,
    ShopCurrencyPipe,
    TextAvatarComponent,
    IconAvatarComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule
  ],
  exports: [
    CurrencyInputComponent,
    PaymentTypeBadgeComponent,
    CategoryLabelPipe,
    UomLabelPipe,
    TransactionTypePipe,
    ShopCurrencyPipe,
    TextAvatarComponent,
    IconAvatarComponent
  ]
})
export class SharedComponentsModule { }
