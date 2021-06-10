import { Pipe, PipeTransform } from '@angular/core';
import { CATEGORIES } from '@app/models/categories';

@Pipe({
  name: 'categoryLabel'
})
export class CategoryLabelPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    const category = CATEGORIES.find(c => c.value == value);
    if (category != undefined)
      return category.label;
    else 
      return value;
  }

}
