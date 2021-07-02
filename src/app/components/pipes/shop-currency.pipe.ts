import { Pipe, PipeTransform } from '@angular/core';
import { formatCurrency, getCurrencySymbol } from '@angular/common';
import { AppState } from '@app/state';
import { Store } from '@ngrx/store';

@Pipe({
  name: 'shopCurrency'
})
export class ShopCurrencyPipe implements PipeTransform {

  currencyCode: string = 'USD';
  constructor(
    private store: Store<AppState>
  ){
    this.store.select(state => state.shop).subscribe(shop => this.currencyCode = shop.currencyCode)
  }

  transform(
    value: number,
    currencyCode: string = this.currencyCode,
    display:
        | 'code'
        | 'symbol'
        | 'symbol-narrow'
        | string
        | boolean = 'symbol',
    digitsInfo: string = '1.2-2',
    locale: string = 'en-US',
): string | null {
    
    return formatCurrency(
      value,
      locale,
      getCurrencySymbol(currencyCode, 'wide'),
      currencyCode,
      digitsInfo,
    );
}

}
