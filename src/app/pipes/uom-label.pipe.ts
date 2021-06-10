import { Pipe, PipeTransform } from '@angular/core';
import { UOMS } from '@app/models/uom';

@Pipe({
  name: 'uomLabel'
})
export class UomLabelPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    const uom = UOMS.find(u => u.value == value);
    if (uom != undefined)
      return uom.label;
    else 
      return value;
  }

}
