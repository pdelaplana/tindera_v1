import { Pipe, PipeTransform } from '@angular/core';
import { InventoryTransactionType } from '@app/models/types';

@Pipe({
  name: 'transactionType'
})
export class TransactionTypePipe implements PipeTransform {

  transform(value: InventoryTransactionType, ...args: unknown[]): string {
    switch (value){
      case InventoryTransactionType.Receipt:
        return 'Receipt';
      case InventoryTransactionType.Issue:
        return 'Issue';
      case InventoryTransactionType.Adjustment:
        return 'Adjustment';
        case InventoryTransactionType.Sale:
          return 'Sale';
          
      default:
        return 'Unknown';
    }
  }

}
